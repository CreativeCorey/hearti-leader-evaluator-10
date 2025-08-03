import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Starting Google Sheets function with workload identity federation!");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqData = await req.json();
    console.log("Received request:", JSON.stringify(reqData, null, 2));

    // Get environment variables
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID");
    const workloadIdentityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG");
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");

    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID environment variable");
    }

    if (!workloadIdentityConfig) {
      throw new Error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG environment variable");
    }

    if (!serviceAccountEmail) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable");
    }

    console.log("Using service account email:", serviceAccountEmail);

    // Parse workload identity configuration
    let workloadConfig;
    try {
      // Handle different formats of workload identity config
      if (workloadIdentityConfig.startsWith('principal://')) {
        // Convert principal format to JSON format
        const principalUrl = workloadIdentityConfig;
        const urlParts = principalUrl.replace('principal://', '').split('/');
        
        if (urlParts.length >= 6) {
          const projectNumber = urlParts[2];
          const poolId = urlParts[5];
          const providerId = urlParts[6] || 'supabase-provider';
          
          workloadConfig = {
            type: "external_account",
            audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            token_url: "https://sts.googleapis.com/v1/token",
            credential_source: {
              headers: {
                "authorization": "Bearer " + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
              },
              url: `https://odwkgxdkjyccnkydxvjw.supabase.co/functions/v1/identity-token`
            },
            service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`
          };
        } else {
          throw new Error("Invalid principal URL format");
        }
      } else {
        // Assume it's already JSON
        workloadConfig = JSON.parse(workloadIdentityConfig);
      }
      
      console.log("Parsed workload identity config successfully");
    } catch (error) {
      console.error("Failed to parse workload identity config:", error.message);
      console.error("Config starts with:", workloadIdentityConfig.substring(0, 50));
      throw new Error(`Invalid workload identity configuration format: ${error.message}. Expected JSON credential file.`);
    }

    // Get access token using workload identity federation
    let accessToken;
    try {
      // First, get the subject token from our identity token endpoint
      const identityTokenResponse = await fetch(workloadConfig.credential_source.url, {
        headers: workloadConfig.credential_source.headers
      });

      if (!identityTokenResponse.ok) {
        throw new Error(`Failed to get identity token: ${identityTokenResponse.statusText}`);
      }

      const identityTokenData = await identityTokenResponse.json();
      const subjectToken = identityTokenData.token;

      // Exchange the subject token for an access token
      const stsResponse = await fetch(workloadConfig.token_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audience: workloadConfig.audience,
          grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
          requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
          subject_token: subjectToken,
          subject_token_type: workloadConfig.subject_token_type,
          scope: 'https://www.googleapis.com/auth/spreadsheets'
        })
      });

      if (!stsResponse.ok) {
        const errorText = await stsResponse.text();
        throw new Error(`STS token exchange failed: ${stsResponse.statusText} - ${errorText}`);
      }

      const stsData = await stsResponse.json();
      
      // Impersonate the service account to get the final access token
      const impersonateResponse = await fetch(workloadConfig.service_account_impersonation_url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stsData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope: ['https://www.googleapis.com/auth/spreadsheets'],
          lifetime: '3600s'
        })
      });

      if (!impersonateResponse.ok) {
        const errorText = await impersonateResponse.text();
        throw new Error(`Service account impersonation failed: ${impersonateResponse.statusText} - ${errorText}`);
      }

      const impersonateData = await impersonateResponse.json();
      accessToken = impersonateData.accessToken;
      
      console.log("Successfully obtained access token via workload identity federation");
    } catch (error) {
      console.error("Error getting access token:", error.message);
      throw new Error(`Authentication failed: ${error.message}`);
    }

    // Handle different request types
    if (reqData.action === 'test') {
      // Test connectivity by trying to read sheet metadata
      try {
        const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
        const testResponse = await fetch(testUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          throw new Error(`Test failed: ${testResponse.statusText} - ${errorText}`);
        }

        const testData = await testResponse.json();
        return new Response(
          JSON.stringify({
            success: true,
            message: "Workload identity federation is working correctly!",
            sheetTitle: testData.properties?.title || "Unknown"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        throw new Error(`Test failed: ${error.message}`);
      }
    }

    if (reqData.action === 'import') {
      // Import data from Google Sheets
      const range = reqData.range || 'A:Z';
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
      
      const response = await fetch(sheetsUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from Google Sheets: ${response.status} - ${errorText}`);
      }

      const sheetsData = await response.json();
      
      if (!sheetsData.values || sheetsData.values.length === 0) {
        throw new Error('No data found in the specified range');
      }

      // Process the data using background processing for large datasets
      const headers = sheetsData.values[0];
      const dataRows = sheetsData.values.slice(1);

      console.log(`Found ${dataRows.length} rows to process from Google Sheets`);

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // For large datasets, use background processing
      if (dataRows.length > 50) {
        const backgroundTask = processLargeImport(supabase, headers, dataRows);
        
        // Use EdgeRuntime.waitUntil to process in background
        if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
          EdgeRuntime.waitUntil(backgroundTask);
        } else {
          backgroundTask.catch(console.error);
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            message: `Large import started in background. Processing ${dataRows.length} rows.`,
            totalRows: dataRows.length,
            note: "Import is processing in the background. Check the function logs for progress.",
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Process small datasets immediately
        const result = await processImportData(supabase, headers, dataRows);
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (reqData.action === 'export') {
      // Export/sync assessment data to Google Sheets
      const assessmentData = reqData.assessmentData;
      if (!assessmentData) {
        throw new Error('Assessment data is required for export');
      }

      // Format data for Google Sheets (using the same format as the existing function)
      const sheetData = formatAssessmentForSheet(assessmentData);
      
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:BV:append?valueInputOption=USER_ENTERED`;
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [sheetData]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to append data to Google Sheets: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Successfully appended data to sheet:", JSON.stringify(result, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Assessment synced to Google Sheet using workload identity federation",
          details: result
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error('Invalid action. Supported actions: test, import, export');

  } catch (error) {
    console.error("Error in edge function:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Google Sheets operation failed. See function logs for details."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Background processing function for large imports
async function processLargeImport(supabase: any, headers: string[], dataRows: any[]) {
  console.log(`Starting background processing of ${dataRows.length} rows`);
  
  let importedProfiles = 0;
  let importedAssessments = 0;
  let errors: string[] = [];
  
  // Convert rows to objects
  const importData = dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });

  // Process in smaller batches with progress logging
  const BATCH_SIZE = 20; // Increased batch size for better performance
  const totalBatches = Math.ceil(importData.length / BATCH_SIZE);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const startIndex = batchIndex * BATCH_SIZE;
    const endIndex = Math.min(startIndex + BATCH_SIZE, importData.length);
    const batch = importData.slice(startIndex, endIndex);
    
    // Log progress every 10 batches
    if (batchIndex % 10 === 0 || batchIndex === totalBatches - 1) {
      console.log(`Background processing: batch ${batchIndex + 1}/${totalBatches} (${Math.round((batchIndex / totalBatches) * 100)}% complete)`);
    }

    // Process batch in parallel for better performance
    const batchPromises = batch.map(row => processRow(supabase, row));
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { profileCreated, assessmentCreated, error } = result.value;
        if (profileCreated) importedProfiles++;
        if (assessmentCreated) importedAssessments++;
        if (error) errors.push(error);
      } else {
        errors.push(`Error processing row ${startIndex + index}: ${result.reason}`);
      }
    });
    
    // Small delay between batches to prevent overwhelming the database
    if (batchIndex < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Background import completed: ${importedProfiles} profiles, ${importedAssessments} assessments, ${errors.length} errors`);
  
  if (errors.length > 0) {
    console.log(`Import errors (first 10):`, errors.slice(0, 10));
  }
}

// Immediate processing function for small imports
async function processImportData(supabase: any, headers: string[], dataRows: any[]) {
  let importedProfiles = 0;
  let importedAssessments = 0;
  let errors: string[] = [];
  
  // Convert rows to objects
  const importData = dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });

  console.log(`Processing ${importData.length} rows immediately`);

  for (const row of importData) {
    try {
      const result = await processRow(supabase, row);
      if (result.profileCreated) importedProfiles++;
      if (result.assessmentCreated) importedAssessments++;
      if (result.error) errors.push(result.error);
    } catch (error) {
      errors.push(`Error processing row: ${error.message}`);
    }
  }

  return {
    success: true,
    imported: {
      profiles: importedProfiles,
      assessments: importedAssessments,
    },
    errors,
    totalRows: dataRows.length,
    note: "Successfully imported data from Google Sheets using workload identity federation",
  };
}

// Single row processing function
async function processRow(supabase: any, row: any) {
  let profileCreated = false;
  let assessmentCreated = false;
  let error: string | null = null;

  try {
    // Extract user info
    const email = row['Contact Email'] || row['E-mail'] || row['Email'] || row['email'] || 
                 row['Contact UID'] || row['UID'] || null;
    const responseId = row['Response ID'] || row['ResponseID'] || row['response_id'] || 
                      row['Contact Personal ID'] || row['Contact UID'] || row['UID'];
    const firstName = row['Contact Name'] || row['First Name'] || row['Name'];
    const lastName = row['Contact Last Name'] || row['Last Name'] || row['LastName'];
    const assessmentDate = row['Date & Time'] || row['Date'] || row['Timestamp'];

    if (!email && !responseId) {
      return { profileCreated, assessmentCreated, error: 'Missing both email and response ID' };
    }

    const finalEmail = email || `response-${responseId}@historical-import.com`;

    // Check if historical profile exists
    const { data: existingUser } = await supabase
      .from('historical_profiles')
      .select('id')
      .eq('email', finalEmail)
      .maybeSingle();

    let userId = existingUser?.id;

    // Create profile if doesn't exist
    if (!existingUser) {
      const { data: newUser, error: profileError } = await supabase
        .from('historical_profiles')
        .insert({
          email: finalEmail,
          name: `${firstName || ''} ${lastName || ''}`.trim() || finalEmail,
          role: 'user',
          source_unique_id: responseId || finalEmail,
        })
        .select('id')
        .single();

      if (profileError) {
        return { profileCreated, assessmentCreated, error: `Failed to create profile: ${profileError.message}` };
      }

      userId = newUser.id;
      profileCreated = true;
    }

    // Extract dimension scores
    const getDimensionScore = (dimension: string) => {
      const patterns = [
        dimension.charAt(0).toUpperCase() + dimension.slice(1),
        `F${['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'].indexOf(dimension) + 13}: ${dimension.charAt(0).toUpperCase() + dimension.slice(1)} (All)`,
      ];
      
      for (const pattern of patterns) {
        if (row[pattern] !== undefined && row[pattern] !== null && row[pattern] !== '') {
          const value = parseFloat(row[pattern]);
          if (!isNaN(value)) {
            return value;
          }
        }
      }
      return 3; // Default value
    };

    const dimensionScores = {
      humility: getDimensionScore('humility'),
      empathy: getDimensionScore('empathy'), 
      accountability: getDimensionScore('accountability'),
      resiliency: getDimensionScore('resiliency'),
      transparency: getDimensionScore('transparency'),
      inclusivity: getDimensionScore('inclusivity'),
    };

    // Extract demographics
    const demographics = {
      managementLevel: row['Q59: My current management level is...'] || '',
      companySize: row['Q60: My company size is...'] || '',
      jobRole: row['Q61: My main job role is...'] || '',
      location: row['Q62: Where are you located?'] || '',
      age: row['Q63: My age is...'] || '',
      gender: row['Q64: My gender identity is...'] || '',
      raceEthnicity: row['Q65: My Race/Ethnicity is...\n(Please check all that apply)'] || '',
      isHistorical: true,
      sourceUniqueId: responseId,
    };

    // Calculate overall score
    let overallScore = parseFloat(row['Total Custom Score']) || 
      (Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 6);
    
    overallScore = Math.max(1, Math.min(5, overallScore));

    const parsedDate = assessmentDate ? new Date(assessmentDate) : new Date();

    // Check for existing assessment
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('historical_profile_id', userId)
      .eq('email', finalEmail)
      .gte('date', new Date(parsedDate.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .lte('date', new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .maybeSingle();

    if (existingAssessment) {
      return { profileCreated, assessmentCreated, error: null };
    }

    // Insert assessment
    const { error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        historical_profile_id: userId,
        date: parsedDate.toISOString(),
        answers: [],
        dimension_scores: dimensionScores,
        overall_score: overallScore,
        demographics,
        email: finalEmail,
      });

    if (assessmentError) {
      return { profileCreated, assessmentCreated, error: `Failed to create assessment: ${assessmentError.message}` };
    }

    assessmentCreated = true;

  } catch (error) {
    return { profileCreated, assessmentCreated, error: `Error processing row: ${error.message}` };
  }

  return { profileCreated, assessmentCreated, error };
}

// Format assessment data for Google Sheets export
function formatAssessmentForSheet(assessmentData: any) {
  const now = new Date();
  const dateTime = assessmentData.date || now.toISOString();
  const contactUid = assessmentData.user_id || 'unknown';
  const email = assessmentData.email || `anonymous@${assessmentData.user_id?.substring(0, 8) || 'unknown'}.com`;
  
  const answers = Array.isArray(assessmentData.answers) ? assessmentData.answers : [];
  const answerMap: { [key: number]: number } = {};
  answers.forEach(answer => {
    if (answer && typeof answer === 'object' && 'questionId' in answer && 'score' in answer) {
      answerMap[answer.questionId] = answer.score;
    }
  });
  
  const getQuestionScore = (questionId: number) => {
    const score = answerMap[questionId];
    return score !== undefined ? score.toString() : "";
  };
  
  const dimScores = assessmentData.dimension_scores || {};
  
  // Build the complete data array matching the expected sheet format
  const sheetData = [
    dateTime, // Date & Time
    "", // Duration
    contactUid, // Contact UID
    assessmentData.demographics?.firstName || "", // First Name
    assessmentData.demographics?.lastName || "", // Last Name
    email, // E-mail
    assessmentData.demographics?.premiumCode || "", // Premium Code
    "Yes", // Privacy policy acceptance
    contactUid, // UID
    
    // Individual question scores Q1-Q58
    ...Array.from({ length: 58 }, (_, i) => getQuestionScore(i + 1)),
    
    assessmentData.overall_score?.toString() || "0", // Overall score
    "290", // Max score
    
    // Dimension scores
    dimScores.humility?.toString() || "0",
    dimScores.empathy?.toString() || "0", 
    dimScores.accountability?.toString() || "0",
    dimScores.resiliency?.toString() || "0",
    dimScores.transparency?.toString() || "0",
    dimScores.inclusivity?.toString() || "0",
    
    assessmentData.assessment_id || `sync-${Date.now()}`, // Unique ID
    "", // Outcome(s)
    "", // Response ID
    ...Array(6).fill(""), // Empty columns
  ];
  
  return sheetData;
}