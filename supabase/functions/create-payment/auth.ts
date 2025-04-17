
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Helper logging function
const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
  }
};

export const authenticateUser = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No authorization header provided");
  }
  
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
  
  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError) {
    logStep("Auth error", userError.message);
    throw new Error(`Authentication error: ${userError.message}`);
  }
  
  const user = userData.user;
  if (!user?.email) {
    logStep("No user email found");
    throw new Error("User not authenticated or email not available");
  }
  
  return user;
};
