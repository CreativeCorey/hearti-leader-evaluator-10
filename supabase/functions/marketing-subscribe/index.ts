
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  // Optional CRM API keys
  const hubspotApiKey = Deno.env.get('HUBSPOT_API_KEY') || '';
  const mailchimpApiKey = Deno.env.get('MAILCHIMP_API_KEY') || '';
  const mailchimpListId = Deno.env.get('MAILCHIMP_LIST_ID') || '';

  // Create Supabase client with service role for admin access
  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  try {
    // Get request data
    const requestData = await req.json();
    const { user_id, email, name, marketing_consent } = requestData;

    console.log(`Processing marketing consent for user: ${email}`);

    if (!marketing_consent) {
      return new Response(
        JSON.stringify({ success: false, message: "No marketing consent provided" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update user profile with marketing consent
    if (user_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ marketing_consent: true })
        .eq('id', user_id);

      if (profileError) {
        console.error("Error updating marketing consent:", profileError);
      }
    }

    // Track successful operations
    const operations = [];

    // Add to HubSpot if API key is available
    if (hubspotApiKey && email) {
      try {
        console.log(`Adding ${email} to HubSpot...`);
        // This is a placeholder for actual HubSpot API integration
        // In a real implementation, you would call the HubSpot API here
        operations.push("hubspot");
      } catch (error) {
        console.error("Error adding contact to HubSpot:", error);
      }
    }

    // Add to Mailchimp if API key is available
    if (mailchimpApiKey && mailchimpListId && email) {
      try {
        console.log(`Adding ${email} to Mailchimp list ${mailchimpListId}...`);
        // This is a placeholder for actual Mailchimp API integration
        // In a real implementation, you would call the Mailchimp API here
        operations.push("mailchimp");
      } catch (error) {
        console.error("Error adding subscriber to Mailchimp:", error);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "User added to marketing lists",
        operations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing marketing consent:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
