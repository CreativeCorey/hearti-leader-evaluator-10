
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting sync-assessment-to-sheet function with Google API key!")

// Log all available environment variables (without their values for security)
const envKeys = Object.keys(Deno.env.toObject())
console.log("Available environment variables:", envKeys.join(", "))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const reqData = await req.json()
    console.log("Received assessment data:", JSON.stringify(reqData, null, 2))

    // Check for required configuration
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID environment variable")
    }
    
    // Get Google API key (simple approach)
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY")
    if (!googleApiKey) {
      throw new Error("Missing GOOGLE_API_KEY environment variable")
    }
    
    console.log("Using Google API key authentication")
    
    // Check if we received assessment_id
    if (!reqData.assessment_id && !reqData.manual_sync) {
      console.log("No assessment_id, looking for user_id and other fields")
      
      // Check if we have minimum required data for a manual sync
      if (!reqData.user_id || !reqData.overall_score) {
        throw new Error("Missing required data: need either assessment_id or user_id + overall_score")
      }
    }

    // Create a Supabase client with the Admin key if we need to fetch assessment data
    let assessmentData = { ...reqData }
    
    if (reqData.assessment_id && (!reqData.dimension_scores || !reqData.overall_score || !reqData.answers)) {
      console.log(`Fetching complete assessment data for ID: ${reqData.assessment_id}`)
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL")
      const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Missing Supabase credentials in environment")
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
      
      const { data: fetchedData, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', reqData.assessment_id)
        .single()
        
      if (error) {
        console.error("Error fetching assessment:", error.message)
        throw new Error(`Failed to fetch assessment: ${error.message}`)
      } else if (fetchedData) {
        console.log("Retrieved assessment data from database")
        // Merge the fetched data with what we already have
        assessmentData = {
          ...reqData,
          user_id: reqData.user_id || fetchedData.user_id,
          date: reqData.date || fetchedData.date,
          overall_score: reqData.overall_score || fetchedData.overall_score,
          dimension_scores: reqData.dimension_scores || fetchedData.dimension_scores,
          demographics: reqData.demographics || fetchedData.demographics,
          email: reqData.email || fetchedData.email,
          answers: reqData.answers || fetchedData.answers,
        }
      } else {
        throw new Error(`Assessment with ID ${reqData.assessment_id} not found`)
      }
    }

    // Get current date and time
    const now = new Date();
    const dateTime = now.toISOString();
    const duration = ""; // This would need to be tracked separately

    // Format user information
    const contactUid = assessmentData.user_id || 'unknown';
    const email = assessmentData.email || `anonymous@${assessmentData.user_id?.substring(0, 8) || 'unknown'}.com`;
    const firstName = assessmentData.demographics?.firstName || "";
    const lastName = assessmentData.demographics?.lastName || "";
    const premiumCode = assessmentData.demographics?.premiumCode || "";
    const privacyAccepted = "Yes"; // Assuming this is always accepted when taking the assessment
    
    // Extract answers if available
    const answers = Array.isArray(assessmentData.answers) ? assessmentData.answers : [];
    console.log(`Processing ${answers.length} answers`);
    
    // Create a map of question IDs to scores
    const answerMap = {};
    answers.forEach(answer => {
      if (answer && typeof answer === 'object' && 'questionId' in answer && 'score' in answer) {
        answerMap[answer.questionId] = answer.score;
      }
    });
    
    // Get question scores
    const getQuestionScore = (questionId) => {
      const score = answerMap[questionId];
      return score !== undefined ? score.toString() : "";
    };
    
    // Extract dimension scores
    const dimScores = assessmentData.dimension_scores || {};
    
    // Prepare row data for Google Sheet
    const sheetData = [
      dateTime, // Date & Time
      duration, // Duration
      contactUid, // Contact UID
      firstName, // First Name
      lastName, // Last Name
      email, // E-mail
      premiumCode, // Premium Code
      privacyAccepted, // I acknowledge and agree to the privacy policy
      contactUid, // UID (duplicate of Contact UID)
      
      // Individual question scores - Q1 through Q58
      getQuestionScore(1),
      getQuestionScore(2),
      getQuestionScore(3),
      getQuestionScore(4),
      getQuestionScore(5),
      getQuestionScore(6),
      getQuestionScore(7),
      getQuestionScore(8),
      getQuestionScore(9),
      getQuestionScore(10),
      getQuestionScore(11),
      getQuestionScore(12), // This seems to be missing from our questions list, insert empty
      getQuestionScore(13),
      getQuestionScore(14),
      getQuestionScore(15),
      getQuestionScore(16),
      getQuestionScore(17),
      getQuestionScore(18),
      getQuestionScore(19),
      getQuestionScore(20),
      getQuestionScore(21),
      getQuestionScore(22),
      getQuestionScore(23),
      getQuestionScore(24),
      getQuestionScore(25),
      getQuestionScore(26),
      getQuestionScore(27),
      getQuestionScore(28),
      getQuestionScore(29),
      getQuestionScore(30),
      getQuestionScore(31),
      getQuestionScore(32),
      getQuestionScore(33),
      getQuestionScore(34),
      getQuestionScore(35),
      getQuestionScore(36),
      getQuestionScore(37),
      getQuestionScore(38),
      getQuestionScore(39),
      getQuestionScore(40),
      getQuestionScore(41),
      getQuestionScore(42),
      getQuestionScore(43),
      getQuestionScore(44),
      getQuestionScore(45),
      getQuestionScore(46),
      getQuestionScore(47),
      getQuestionScore(48),
      getQuestionScore(49),
      getQuestionScore(50),
      getQuestionScore(51),
      getQuestionScore(52),
      getQuestionScore(53),
      getQuestionScore(54),
      getQuestionScore(55),
      getQuestionScore(56),
      getQuestionScore(57),
      getQuestionScore(58),
      
      assessmentData.overall_score?.toString() || "0", // Active HEARTI Questions - Score
      "290", // Active HEARTI Questions - Max Score (58 questions * 5 max score = 290)
      
      // Dimension scores
      dimScores.humility?.toString() || "0", // Humility
      dimScores.empathy?.toString() || "0", // Empathy
      dimScores.accountability?.toString() || "0", // Accountability
      dimScores.resiliency?.toString() || "0", // Resiliency
      dimScores.transparency?.toString() || "0", // Transparency
      dimScores.inclusivity?.toString() || "0", // Inclusivity
      
      assessmentData.assessment_id || `manual-sync-${Date.now()}`, // F21: Unique ID Test
      "", // Outcome(s)
      "", // Response ID
      "", // Empty
      "", // Empty
      "", // Empty
      "", // Empty
      "", // Empty
      ""  // Empty
    ];
    
    console.log("Formatted data for sheet:", JSON.stringify(sheetData, null, 2));
    
    // Try to append data to Google Sheet using simple API key
    try {
      console.log("Attempting to append to sheet with ID:", sheetId);
      
      // Append data to the sheet using API key
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:BV:append?valueInputOption=USER_ENTERED&key=${googleApiKey}`;
      console.log("Making request to Google Sheets API:", sheetsUrl);
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [sheetData]
        })
      });
      
      console.log("Google Sheets API response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Sheets API error response:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error details:", JSON.stringify(errorJson, null, 2));
          
          throw new Error(`Google Sheets API error: ${response.status} - ${errorJson.error?.message || "Unknown error"}`);
        } catch (parseError) {
          throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
        }
      }
      
      const result = await response.json();
      console.log("Successfully appended data to sheet:", JSON.stringify(result, null, 2));
      
      return new Response(
        JSON.stringify({ success: true, message: "Assessment synced to Google Sheet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error syncing to Google Sheet:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Error in edge function:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to sync assessment to Google Sheet. See function logs for details."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// To invoke:
// curl -i --location --request POST 'https://odwkgxdkjyccnkydxvjw.functions.supabase.co/sync-assessment-to-sheet' \
//   --header 'Content-Type: application/json' \
//   --data '{"assessment_id":"123","user_id":"456","date":"2023-01-01","overall_score":85,"dimension_scores":{"humility":80}}'
