
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { GoogleSpreadsheet } from 'npm:google-spreadsheet@4.1.1'
import { GaxiosOptions } from 'npm:gaxios@5.1.0'
import { AuthClient, ExternalAccountClient } from 'npm:google-auth-library@9.0.0'

// Workload Identity Federation configuration
const GOOGLE_WORKLOAD_IDENTITY_CONFIG = Deno.env.get('GOOGLE_WORKLOAD_IDENTITY_CONFIG')
const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID')

// Create a new client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Format dimension scores for readability
function formatDimensionScores(dimensionScores: Record<string, number>) {
  const dimensions = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity']
  const result: Record<string, number> = {}
  
  dimensions.forEach(dim => {
    if (dimensionScores[dim] !== undefined) {
      result[dim] = dimensionScores[dim]
    }
  })
  
  return result
}

// Format demographics for readability
function formatDemographics(demographics: any) {
  if (!demographics) return {}
  
  return {
    managementLevel: demographics.managementLevel || '',
    companySize: demographics.companySize || '',
    jobRole: demographics.jobRole || '',
    location: demographics.location || '',
    ageRange: demographics.ageRange || '',
    genderIdentity: demographics.genderIdentity || '',
    raceEthnicity: Array.isArray(demographics.raceEthnicity) 
      ? demographics.raceEthnicity.join(', ') 
      : (demographics.raceEthnicity || '')
  }
}

// Create an auth client using Workload Identity Federation
async function getAuthClient(): Promise<AuthClient> {
  if (!GOOGLE_WORKLOAD_IDENTITY_CONFIG) {
    throw new Error('Missing Workload Identity Federation configuration');
  }
  
  try {
    // Parse the workload identity configuration
    const workloadIdentityConfig = JSON.parse(GOOGLE_WORKLOAD_IDENTITY_CONFIG);
    
    // Create the auth client with the configuration
    const client = new ExternalAccountClient(
      {
        audience: workloadIdentityConfig.audience,
        subject_token_type: workloadIdentityConfig.subject_token_type,
        token_url: workloadIdentityConfig.token_url,
        service_account_impersonation_url: workloadIdentityConfig.service_account_impersonation_url,
        client_id: workloadIdentityConfig.client_id,
        client_secret: workloadIdentityConfig.client_secret,
        credential_source: workloadIdentityConfig.credential_source,
        quota_project_id: workloadIdentityConfig.quota_project_id,
        workforce_pool_user_project: workloadIdentityConfig.workforce_pool_user_project,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      },
    );
    
    return client;
  } catch (error) {
    console.error('Error creating auth client:', error);
    throw new Error(`Failed to create auth client: ${error.message}`);
  }
}

// Custom auth for GoogleSpreadsheet using Workload Identity Federation
class WorkloadIdentityAuthForGoogleSpreadsheet {
  private client: AuthClient;
  
  constructor(client: AuthClient) {
    this.client = client;
  }
  
  async authorizeRequest(request: GaxiosOptions): Promise<GaxiosOptions> {
    // Get access token
    const token = await this.client.getAccessToken();
    
    // Set authorization header
    if (!request.headers) {
      request.headers = {};
    }
    request.headers.Authorization = `Bearer ${token.token}`;
    
    return request;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Validate Google credentials
    if (!GOOGLE_WORKLOAD_IDENTITY_CONFIG || !GOOGLE_SHEET_ID) {
      console.error('Missing Google configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error - missing Google configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Parse request data
    const requestData = await req.json()
    console.log('Received request data:', JSON.stringify(requestData))
    
    // Get assessment details if only assessment_id is provided
    let assessmentData = requestData
    
    if (requestData.assessment_id && !requestData.dimension_scores) {
      const { data, error } = await supabaseClient
        .from('assessments')
        .select('*')
        .eq('id', requestData.assessment_id)
        .single()
      
      if (error) {
        console.error('Error fetching assessment data:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch assessment data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      assessmentData = {
        assessment_id: data.id,
        user_id: data.user_id,
        date: data.date,
        overall_score: data.overall_score,
        dimension_scores: data.dimension_scores,
        demographics: data.demographics
      }
    }
    
    // Get user details
    const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', assessmentData.user_id)
      .single()
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userError)
      // Continue execution even if user data is not found
    }
    
    // Format dimension scores
    const dimensionScores = formatDimensionScores(assessmentData.dimension_scores || {})
    
    // Format demographics
    const demographics = formatDemographics(assessmentData.demographics)
    
    // Convert date to readable format
    const dateObj = new Date(assessmentData.date)
    const formattedDate = dateObj.toISOString().split('T')[0]
    
    // Create row for Google Sheet
    const rowData = {
      'Assessment ID': assessmentData.assessment_id,
      'User ID': assessmentData.user_id,
      'User Email': userData?.email || 'N/A',
      'User Name': userData?.name || 'N/A',
      'Organization ID': userData?.organization_id || 'N/A',
      'Date': formattedDate,
      'Overall Score': assessmentData.overall_score,
      // Dimension scores
      'Humility Score': dimensionScores.humility || 0,
      'Empathy Score': dimensionScores.empathy || 0,
      'Accountability Score': dimensionScores.accountability || 0,
      'Resiliency Score': dimensionScores.resiliency || 0,
      'Transparency Score': dimensionScores.transparency || 0,
      'Inclusivity Score': dimensionScores.inclusivity || 0,
      // Demographics
      'Management Level': demographics.managementLevel,
      'Company Size': demographics.companySize,
      'Job Role': demographics.jobRole,
      'Location': demographics.location,
      'Age Range': demographics.ageRange,
      'Gender Identity': demographics.genderIdentity,
      'Race/Ethnicity': demographics.raceEthnicity
    }
    
    // Initialize auth client using Workload Identity Federation
    console.log('Initializing auth client with Workload Identity Federation...');
    const authClient = await getAuthClient();
    const authForGoogleSpreadsheet = new WorkloadIdentityAuthForGoogleSpreadsheet(authClient);
    
    // Initialize the spreadsheet
    console.log('Initializing Google Spreadsheet...');
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
    // @ts-ignore - The type definitions don't include this authentication method
    doc.useRawAccessToken(authForGoogleSpreadsheet);
    await doc.loadInfo();
    
    // Get the first sheet or create it if it doesn't exist
    let sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      console.log('Creating new sheet...');
      sheet = await doc.addSheet({ title: 'HEARTI Assessment Results' });
    }
    
    // Check if headers exist, if not add them
    console.log('Checking if headers exist...');
    const rows = await sheet.getRows();
    if (rows.length === 0) {
      console.log('Adding headers to sheet...');
      await sheet.setHeaderRow(Object.keys(rowData));
    }
    
    // Add the new row
    console.log('Adding new row to sheet...');
    await sheet.addRow(rowData);
    
    console.log('Successfully added assessment to Google Sheet');
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Assessment added to Google Sheet' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
