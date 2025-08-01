import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting historical data cleanup...');

    // Delete all historical assessments first (to avoid foreign key issues)
    const { count: assessmentCount, error: assessmentError } = await supabase
      .from('assessments')
      .delete({ count: 'exact' })
      .not('historical_profile_id', 'is', null);

    if (assessmentError) {
      console.error('Failed to delete historical assessments:', assessmentError);
      throw new Error(`Failed to delete historical assessments: ${assessmentError.message}`);
    }

    console.log(`Deleted ${assessmentCount || 0} historical assessments`);

    // Delete all historical profiles
    const { count: profileCount, error: profileError } = await supabase
      .from('historical_profiles')
      .delete({ count: 'exact' })
      .eq('is_historical', true);

    if (profileError) {
      console.error('Failed to delete historical profiles:', profileError);
      throw new Error(`Failed to delete historical profiles: ${profileError.message}`);
    }

    console.log(`Deleted ${profileCount || 0} historical profiles`);

    const result = {
      success: true,
      deletedProfiles: profileCount || 0,
      deletedAssessments: assessmentCount || 0,
      message: `Successfully deleted ${assessmentCount || 0} historical assessments and ${profileCount || 0} historical profiles`
    };

    console.log('Historical data cleanup completed:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Historical data cleanup error:', error);
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