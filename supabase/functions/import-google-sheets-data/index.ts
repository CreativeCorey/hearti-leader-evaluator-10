import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface ImportRow {
  // Contact info
  'Contact Email': string;
  'Contact Personal ID': string;
  'Contact UID': string;
  'Contact Name': string;
  'Contact Last Name': string;
  'First Name': string;
  'Last Name': string;
  'E-mail': string;
  'Date & Time': string;
  
  // Demographics
  'Q59: My current management level is...': string;
  'Q60: My company size is...': string;
  'Q61: My main job role is...': string;
  'Q62: Where are you located?': string;
  'Q63: My age is...': string;
  'Q64: My gender identity is...': string;
  'Q65: My Race/Ethnicity is...\n(Please check all that apply)': string;
  
  // Calculated factors
  'F13: Humility (All)': string;
  'F14: Empathy (All)': string;
  'F15: Accountability (All)': string;
  'F16: Resiliency (All)': string;
  'F17: Transparency (All)': string;
  'F18: Inclusivity (All)': string;
  'Total Custom Score': string;
  
  // Question scores (Q1-Q65)
  [key: string]: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { sheetId, range = 'Sheet1!A:Z' } = await req.json();

    if (!sheetId) {
      throw new Error('Sheet ID is required');
    }

    console.log('Starting Google Sheets import from sheet:', sheetId);

    // Get Google API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      throw new Error('Google API key not configured');
    }

    // Fetch data from Google Sheets API
    const actualRange = range || 'A:Z';
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${actualRange}?key=${googleApiKey}`;
    
    console.log('Fetching data from Google Sheets API...');
    const response = await fetch(sheetsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Failed to fetch data from Google Sheets: ${response.status} - ${errorText}`);
    }

    const sheetsData = await response.json();
    
    if (!sheetsData.values || sheetsData.values.length === 0) {
      throw new Error('No data found in the specified range');
    }

    const headers = sheetsData.values[0];
    const dataRows = sheetsData.values.slice(1);

    console.log(`Found ${dataRows.length} rows to process from Google Sheets`);
    console.log(`Available columns (first 20):`, headers.slice(0, 20));
    
    // For large datasets, use background processing
    if (dataRows.length > 50) {
      // Start background processing
      const backgroundTask = processLargeImport(supabase, headers, dataRows);
      
      // Use EdgeRuntime.waitUntil to process in background
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(backgroundTask);
      } else {
        // Fallback for environments that don't support EdgeRuntime
        backgroundTask.catch(console.error);
      }
      
      // Return immediate response
      return new Response(
        JSON.stringify({
          success: true,
          message: `Large import started in background. Processing ${dataRows.length} rows.`,
          totalRows: dataRows.length,
          note: "Import is processing in the background. Check the function logs for progress.",
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Process small datasets immediately
      const result = await processImportData(supabase, headers, dataRows);
      return new Response(
        JSON.stringify(result),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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
  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(importData.length / BATCH_SIZE);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const startIndex = batchIndex * BATCH_SIZE;
    const endIndex = Math.min(startIndex + BATCH_SIZE, importData.length);
    const batch = importData.slice(startIndex, endIndex);
    
    // Log progress every 20 batches
    if (batchIndex % 20 === 0 || batchIndex === totalBatches - 1) {
      console.log(`Background processing: batch ${batchIndex + 1}/${totalBatches} (${Math.round((batchIndex / totalBatches) * 100)}% complete)`);
    }

    for (const row of batch) {
      try {
        const result = await processRow(supabase, row);
        if (result.profileCreated) importedProfiles++;
        if (result.assessmentCreated) importedAssessments++;
        if (result.error) errors.push(result.error);
      } catch (error) {
        errors.push(`Error processing row: ${error.message}`);
      }
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`Background import completed: ${importedProfiles} profiles, ${importedAssessments} assessments, ${errors.length} errors`);
  
  // Log completion summary
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
    note: "Successfully imported data from Google Sheets",
  };
}

// Single row processing function
async function processRow(supabase: any, row: any) {
  let profileCreated = false;
  let assessmentCreated = false;
  let error: string | null = null;

  try {
    // Extract user info - try multiple possible column names based on actual sheet structure
    const email = row['Contact Email'] || row['E-mail'] || row['Email'] || row['email'] || 
                 row['Contact UID'] || row['UID'] || null;
    const uniqueId = row['Contact Personal ID'] || row['Contact UID'] || row['UID'] || row['Personal ID'] || row['ID'] || row['id'];
    const firstName = row['Contact Name'] || row['First Name'] || row['Name'] || row['name'];
    const lastName = row['Contact Last Name'] || row['Last Name'] || row['LastName'] || row['lastname'];
    const assessmentDate = row['Date & Time'] || row['Date'] || row['Timestamp'];

    if (!email && !uniqueId) {
      return { profileCreated, assessmentCreated, error: 'Missing both email and unique ID' };
    }

    // Generate email from UID if missing
    const finalEmail = email || `${uniqueId}@historical-import.com`;

    // Check if historical profile exists by email
    const { data: existingUser } = await supabase
      .from('historical_profiles')
      .select('id')
      .eq('email', finalEmail)
      .maybeSingle();

    let userId = existingUser?.id;

    // If user doesn't exist, create profile
    if (!existingUser) {
      const { data: newUser, error: profileError } = await supabase
        .from('historical_profiles')
        .insert({
          email: finalEmail,
          name: `${firstName || ''} ${lastName || ''}`.trim() || finalEmail,
          role: 'user',
          source_unique_id: uniqueId || finalEmail,
        })
        .select('id')
        .single();

      if (profileError) {
        return { profileCreated, assessmentCreated, error: `Failed to create profile for ${finalEmail}: ${profileError.message}` };
      }

      userId = newUser.id;
      profileCreated = true;
    }

    // Extract dimension scores with detailed logging
    console.log(`Processing dimension scores for user: ${finalEmail}`);
    console.log(`Available columns for dimension scores:`, Object.keys(row).filter(key => 
      key.toLowerCase().includes('humility') || 
      key.toLowerCase().includes('empathy') || 
      key.toLowerCase().includes('accountability') || 
      key.toLowerCase().includes('resiliency') || 
      key.toLowerCase().includes('transparency') || 
      key.toLowerCase().includes('inclusivity') ||
      key.startsWith('F1')
    ));

    const dimensionScores = {
      humility: parseFloat(row['F13: Humility (All)'] || row['Humility'] || row['humility'] || row['F13']) || 3,
      empathy: parseFloat(row['F14: Empathy (All)'] || row['Empathy'] || row['empathy'] || row['F14']) || 3,
      accountability: parseFloat(row['F15: Accountability (All)'] || row['Accountability'] || row['accountability'] || row['F15']) || 3,
      resiliency: parseFloat(row['F16: Resiliency (All)'] || row['Resiliency'] || row['resiliency'] || row['F16']) || 3,
      transparency: parseFloat(row['F17: Transparency (All)'] || row['Transparency'] || row['transparency'] || row['F17']) || 3,
      inclusivity: parseFloat(row['F18: Inclusivity (All)'] || row['Inclusivity'] || row['inclusivity'] || row['F18']) || 3,
    };

    console.log(`Raw dimension values for ${finalEmail}:`, {
      humility: row['F13: Humility (All)'] || row['Humility'] || row['humility'] || row['F13'],
      empathy: row['F14: Empathy (All)'] || row['Empathy'] || row['empathy'] || row['F14'],
      accountability: row['F15: Accountability (All)'] || row['Accountability'] || row['accountability'] || row['F15'],
      resiliency: row['F16: Resiliency (All)'] || row['Resiliency'] || row['resiliency'] || row['F16'],
      transparency: row['F17: Transparency (All)'] || row['Transparency'] || row['transparency'] || row['F17'],
      inclusivity: row['F18: Inclusivity (All)'] || row['Inclusivity'] || row['inclusivity'] || row['F18'],
    });
    
    console.log(`Parsed dimension scores for ${finalEmail}:`, dimensionScores);

    // Extract actual answers from Q1-Q65 columns with different possible formats
    const answers: number[] = [];
    for (let i = 1; i <= 65; i++) {
      const questionKey = `Q${i}`;
      const questionKeyScore = `Q${i}: I regularly acknowledge when I don't know the answer - Score`;
      const questionKeyNumber = `Q${i}: I regularly acknowledge when I don't know the answer - Number`;
      
      let answerValue = parseFloat(row[questionKey]) || 
                       parseFloat(row[questionKeyScore]) || 
                       parseFloat(row[questionKeyNumber]) || 
                       3;
      
      // Ensure answer is within valid range (1-5)
      answerValue = Math.max(1, Math.min(5, answerValue));
      answers.push(answerValue);
    }

    // Extract demographics
    const demographics = {
      managementLevel: row['Q59: My current management level is...'] || '',
      companySize: row['Q60: My company size is...'] || '',
      jobRole: row['Q61: My main job role is...'] || '',
      isHistorical: true,
      sourceUniqueId: uniqueId,
    };

    // Calculate overall score safely
    let overallScore = parseFloat(row['Total Custom Score']) || 
      (Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 6);
    
    // Ensure overall score is within valid range
    overallScore = Math.max(1, Math.min(5, overallScore));

    // Parse assessment date
    const parsedDate = assessmentDate ? new Date(assessmentDate) : new Date();

    // Check if assessment already exists for this user and date
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('historical_profile_id', userId)
      .eq('email', finalEmail)
      .gte('date', new Date(parsedDate.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .lte('date', new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .maybeSingle();

    if (existingAssessment) {
      return { profileCreated, assessmentCreated, error: null }; // Skip duplicate
    }

    // Insert assessment
    const { error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        historical_profile_id: userId,
        date: parsedDate.toISOString(),
        answers,
        dimension_scores: dimensionScores,
        overall_score: overallScore,
        demographics,
        email: finalEmail,
      });

    if (assessmentError) {
      return { profileCreated, assessmentCreated, error: `Failed to create assessment for ${finalEmail}: ${assessmentError.message}` };
    }

    assessmentCreated = true;

  } catch (error) {
    return { profileCreated, assessmentCreated, error: `Error processing row: ${error.message}` };
  }

  return { profileCreated, assessmentCreated, error };
}