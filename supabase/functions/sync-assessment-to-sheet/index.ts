
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from sync-assessment-to-sheet edge function!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const reqData = await req.json()
    console.log("Received assessment data:", JSON.stringify(reqData))

    // Log what we're about to do
    console.log("Attempting to sync assessment to Google Sheet")

    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Build data for Google Sheet
    const email = reqData.email || `anonymous@${reqData.user_id.substring(0, 8)}.com`
    const date = new Date(reqData.date).toISOString().split('T')[0]
    
    // Format dimension scores
    const dimScores = reqData.dimension_scores || {}
    
    // Extract demographics if available
    const demo = reqData.demographics || {}
    
    // Prepare row data for Google Sheet
    const sheetData = {
      email,
      date,
      overall_score: reqData.overall_score,
      humility: dimScores.humility || 0,
      empathy: dimScores.empathy || 0,
      accountability: dimScores.accountability || 0,
      resiliency: dimScores.resiliency || 0,
      transparency: dimScores.transparency || 0,
      inclusivity: dimScores.inclusivity || 0,
      // Demographics info
      gender: demo.gender || 'Not specified',
      race: demo.race || 'Not specified',
      age: demo.age || 'Not specified',
      location: demo.location || 'Not specified',
      role: demo.role || 'Not specified',
      management_level: demo.managementLevel || 'Not specified',
      company_size: demo.companySize || 'Not specified',
    }
    
    console.log("Formatted data for sheet:", JSON.stringify(sheetData))

    // Make request to Google Sheets API
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    
    if (!serviceAccountEmail || !sheetId) {
      throw new Error("Missing Google Sheets configuration")
    }

    console.log(`Using Sheet ID: ${sheetId} with service account: ${serviceAccountEmail}`)
    
    // Convert data to an array of values for the sheet
    const values = [
      sheetData.email,
      sheetData.date,
      sheetData.overall_score,
      sheetData.humility,
      sheetData.empathy,
      sheetData.accountability,
      sheetData.resiliency,
      sheetData.transparency,
      sheetData.inclusivity,
      sheetData.gender,
      sheetData.race,
      sheetData.age,
      sheetData.location,
      sheetData.role,
      sheetData.management_level,
      sheetData.company_size
    ]
    
    // Use the Identity Token to authenticate with Google
    try {
      // Get workload identity token
      const identityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      if (!identityConfig) {
        throw new Error("Missing Google workload identity configuration")
      }
      
      console.log("Attempting to append to sheet...")
      
      // Append data to the sheet
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:P:append?valueInputOption=USER_ENTERED`
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${identityConfig}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [values]
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Google Sheets API error:", errorText)
        throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log("Successfully appended data to sheet:", JSON.stringify(result))
      
      return new Response(
        JSON.stringify({ success: true, message: "Assessment synced to Google Sheet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } catch (error) {
      console.error("Error syncing to Google Sheet:", error.message)
      throw error
    }
  } catch (error) {
    console.error("Error in edge function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

// To invoke:
// curl -i --location --request POST 'https://odwkgxdkjyccnkydxvjw.functions.supabase.co/sync-assessment-to-sheet' \
//   --header 'Content-Type: application/json' \
//   --data '{"assessment_id":"123","user_id":"456","date":"2023-01-01","overall_score":85,"dimension_scores":{"humility":80}}'
