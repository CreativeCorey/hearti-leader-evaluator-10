import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get access token using workload identity
    const identityResponse = await fetch(
      `${supabaseUrl}/functions/v1/identity-token`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Metadata-Flavor': 'Google',
        },
      }
    );

    if (!identityResponse.ok) {
      const errorText = await identityResponse.text();
      throw new Error(`Failed to get identity token: ${errorText}`);
    }

    const identityToken = await identityResponse.text();

    // Exchange for Google access token
    const workloadConfig = JSON.parse(Deno.env.get('GOOGLE_WORKLOAD_IDENTITY_CONFIG')!);
    const tokenResponse = await fetch('https://sts.googleapis.com/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        audience: workloadConfig.audience,
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        subject_token: identityToken,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenData.error_description || tokenData.error}`);
    }

    // Read from Google Sheets
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!sheetsResponse.ok) {
      const errorData = await sheetsResponse.json();
      throw new Error(`Sheets API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const sheetsData = await sheetsResponse.json();
    const rows = sheetsData.values;

    if (!rows || rows.length < 2) {
      throw new Error('No data found in the sheet');
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    console.log(`Found ${dataRows.length} rows to process`);

    // Convert rows to objects
    const importData: ImportRow[] = dataRows.map(row => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    let importedProfiles = 0;
    let importedAssessments = 0;
    let errors: string[] = [];

    for (const row of importData) {
      try {
        // Extract user info
        const email = row['Contact Email'] || row['E-mail'];
        const uniqueId = row['Contact Personal ID'] || row['Contact UID'];
        const firstName = row['Contact Name'] || row['First Name'];
        const lastName = row['Contact Last Name'] || row['Last Name'];
        const assessmentDate = row['Date & Time'];

        if (!email || !uniqueId) {
          errors.push(`Skipping row: Missing email or unique ID`);
          continue;
        }

        // Check if user exists by email
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        let userId = existingUser?.id;

        // If user doesn't exist, create profile
        if (!existingUser) {
          const { data: newUser, error: profileError } = await supabase
            .from('profiles')
            .insert({
              email,
              name: `${firstName} ${lastName}`.trim(),
              role: 'user',
            })
            .select('id')
            .single();

          if (profileError) {
            errors.push(`Failed to create profile for ${email}: ${profileError.message}`);
            continue;
          }

          userId = newUser.id;
          importedProfiles++;
        }

        // Extract question answers (Q1-Q65)
        const answers: number[] = [];
        for (let i = 1; i <= 65; i++) {
          const questionKey = `Q${i}:`;
          const scoreKey = Object.keys(row).find(key => 
            key.startsWith(questionKey) && key.endsWith('- Score')
          );
          
          if (scoreKey && row[scoreKey]) {
            const score = parseFloat(row[scoreKey]);
            if (!isNaN(score) && score >= 1 && score <= 5) {
              answers.push(score);
            } else {
              answers.push(3); // Default middle score
            }
          } else {
            answers.push(3); // Default middle score
          }
        }

        // Extract dimension scores
        const dimensionScores = {
          humility: parseFloat(row['F13: Humility (All)']) || 3,
          empathy: parseFloat(row['F14: Empathy (All)']) || 3,
          accountability: parseFloat(row['F15: Accountability (All)']) || 3,
          resiliency: parseFloat(row['F16: Resiliency (All)']) || 3,
          transparency: parseFloat(row['F17: Transparency (All)']) || 3,
          inclusivity: parseFloat(row['F18: Inclusivity (All)']) || 3,
        };

        // Extract demographics
        const demographics = {
          managementLevel: row['Q59: My current management level is...'] || '',
          companySize: row['Q60: My company size is...'] || '',
          jobRole: row['Q61: My main job role is...'] || '',
          location: row['Q62: Where are you located?'] || '',
          ageRange: row['Q63: My age is...'] || '',
          genderIdentity: row['Q64: My gender identity is...'] || '',
          raceEthnicity: row['Q65: My Race/Ethnicity is...\n(Please check all that apply)'] || '',
          isHistorical: true, // Mark as historical data
          sourceUniqueId: uniqueId, // Store original unique ID
        };

        // Calculate overall score
        const overallScore = parseFloat(row['Total Custom Score']) || 
          (Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 6);

        // Parse assessment date
        const parsedDate = assessmentDate ? new Date(assessmentDate) : new Date();

        // Insert assessment
        const { error: assessmentError } = await supabase
          .from('assessments')
          .insert({
            user_id: userId,
            date: parsedDate.toISOString(),
            answers,
            dimension_scores: dimensionScores,
            overall_score: overallScore,
            demographics,
            email,
          });

        if (assessmentError) {
          errors.push(`Failed to create assessment for ${email}: ${assessmentError.message}`);
          continue;
        }

        importedAssessments++;

      } catch (error) {
        errors.push(`Error processing row: ${error.message}`);
      }
    }

    console.log(`Import completed: ${importedProfiles} profiles, ${importedAssessments} assessments`);

    return new Response(
      JSON.stringify({
        success: true,
        imported: {
          profiles: importedProfiles,
          assessments: importedAssessments,
        },
        errors,
        totalRows: dataRows.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

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