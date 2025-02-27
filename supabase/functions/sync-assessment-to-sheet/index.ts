
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { GoogleSpreadsheet } from 'npm:google-spreadsheet@4.1.1'
import { JWT } from 'npm:google-auth-library@9.0.0'

const GOOGLE_SERVICE_ACCOUNT_EMAIL = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
const GOOGLE_PRIVATE_KEY = Deno.env.get('GOOGLE_PRIVATE_KEY')
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
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.error('Missing Google API credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error - missing Google credentials' }),
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
    
    // Configure auth for Google Sheets
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    })
    
    // Initialize the spreadsheet
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth)
    await doc.loadInfo()
    
    // Get the first sheet or create it if it doesn't exist
    let sheet = doc.sheetsByIndex[0]
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'HEARTI Assessment Results' })
    }
    
    // Check if headers exist, if not add them
    const rows = await sheet.getRows()
    if (rows.length === 0) {
      await sheet.setHeaderRow(Object.keys(rowData))
    }
    
    // Add the new row
    await sheet.addRow(rowData)
    
    console.log('Successfully added assessment to Google Sheet')
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Assessment added to Google Sheet' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
