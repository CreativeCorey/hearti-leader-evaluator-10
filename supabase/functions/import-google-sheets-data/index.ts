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
    // Use default range if none provided
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
    console.log(`Available columns: ${headers.join(', ')}`);

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

    // Process data in batches to avoid timeouts
    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(importData.length / BATCH_SIZE);
    
    console.log(`Processing ${importData.length} rows in ${totalBatches} batches of ${BATCH_SIZE}`);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const endIndex = Math.min(startIndex + BATCH_SIZE, importData.length);
      const batch = importData.slice(startIndex, endIndex);
      
      console.log(`Processing batch ${batchIndex + 1}/${totalBatches} (rows ${startIndex + 1}-${endIndex})`);

      for (const row of batch) {
      try {
        // Extract user info - try multiple possible column names
        const email = row['Contact Email'] || row['E-mail'] || row['Email'] || row['email'];
        const uniqueId = row['Contact Personal ID'] || row['Contact UID'] || row['Personal ID'] || row['UID'] || row['ID'] || row['id'];
        const firstName = row['Contact Name'] || row['First Name'] || row['Name'] || row['name'];
        const lastName = row['Contact Last Name'] || row['Last Name'] || row['LastName'] || row['lastname'];
        const assessmentDate = row['Date & Time'] || row['Date'] || row['Timestamp'];

        console.log(`Processing row: email=${email}, uniqueId=${uniqueId}, firstName=${firstName}, lastName=${lastName}`);

        if (!email) {
          errors.push(`Skipping row: Missing email (available columns: ${Object.keys(row).join(', ')})`);
          continue;
        }

        // Check if historical profile exists by email
        const { data: existingUser } = await supabase
          .from('historical_profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        let userId = existingUser?.id;

        // If user doesn't exist, create profile
        if (!existingUser) {
          // Generate a UUID using native crypto API
          const newUuid = crypto.randomUUID();
          
          const { data: newUser, error: profileError } = await supabase
            .from('historical_profiles')
            .insert({
              email,
              name: `${firstName || ''} ${lastName || ''}`.trim() || email,
              role: 'user',
              source_unique_id: uniqueId || email,
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

        // Extract dimension scores - try multiple possible column name formats
        const dimensionScores = {
          humility: parseFloat(row['F13: Humility (All)'] || row['Humility'] || row['humility'] || row['F13']) || 0,
          empathy: parseFloat(row['F14: Empathy (All)'] || row['Empathy'] || row['empathy'] || row['F14']) || 0,
          accountability: parseFloat(row['F15: Accountability (All)'] || row['Accountability'] || row['accountability'] || row['F15']) || 0,
          resiliency: parseFloat(row['F16: Resiliency (All)'] || row['Resiliency'] || row['resiliency'] || row['F16']) || 0,
          transparency: parseFloat(row['F17: Transparency (All)'] || row['Transparency'] || row['transparency'] || row['F17']) || 0,
          inclusivity: parseFloat(row['F18: Inclusivity (All)'] || row['Inclusivity'] || row['inclusivity'] || row['F18']) || 0,
        };

        console.log(`Dimension scores for ${email}:`, dimensionScores);

        // Extract actual answers from Q1-Q65 columns
        const answers: number[] = [];
        for (let i = 1; i <= 65; i++) {
          const questionKey = `Q${i}`;
          const answerValue = parseFloat(row[questionKey]) || 3; // Default to 3 if missing
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

        // Calculate overall score
        const overallScore = parseFloat(row['Total Custom Score']) || 
          (Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 6);

        // Parse assessment date
        const parsedDate = assessmentDate ? new Date(assessmentDate) : new Date();

        // Check if assessment already exists for this user and date
        const { data: existingAssessment } = await supabase
          .from('assessments')
          .select('id')
          .eq('historical_profile_id', userId)
          .eq('email', email)
          .gte('date', new Date(parsedDate.getTime() - 24 * 60 * 60 * 1000).toISOString()) // Within 24 hours
          .lte('date', new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle();

        if (existingAssessment) {
          console.log(`Skipping duplicate assessment for ${email} on ${parsedDate.toISOString()}`);
          continue;
        }

        // Insert assessment
        const { error: assessmentError } = await supabase
          .from('assessments')
          .insert({
            historical_profile_id: userId, // Use historical_profile_id for historical data
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
      
      // Add a small delay between batches to avoid overwhelming the system
      if (batchIndex < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
        note: "Successfully imported data from Google Sheets",
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