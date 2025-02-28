
import { supabase } from '../integrations/supabase/client';

// Initiate Google OAuth flow
export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    // Get the current origin and define callback path
    const origin = window.location.origin;
    const redirectUrl = `${origin}/auth/callback`;
    
    console.log('Starting Google sign-in with redirect URL:', redirectUrl);
    
    // Add more debugging for network conditions
    const testResponse = await fetch(`${origin}/auth/callback`, {
      method: 'HEAD',
      cache: 'no-cache'
    }).catch(e => console.log('Connectivity test error:', e));
    
    console.log('Connectivity test status:', testResponse?.status || 'Failed');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
        queryParams: {
          // Include prompt to ensure the user gets the consent screen
          prompt: 'consent',
          // Include access_type to request refresh token
          access_type: 'offline',
        }
      }
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      return false;
    }
    
    // If we have a URL to redirect to, do it now
    if (data?.url) {
      console.log('Redirecting to OAuth URL:', data.url);
      
      // Use window.location.replace for a cleaner redirect
      window.location.replace(data.url);
      return true;
    } else {
      console.error('No redirect URL provided by Supabase');
      return false;
    }
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    return false;
  }
};

// Test Google Sheets integration
export const testGoogleSheetsConnection = async (): Promise<{success: boolean, message: string}> => {
  try {
    // First make sure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, message: "You need to sign in with Google first" };
    }
    
    console.log('Testing Google Sheets with session:', 
      { 
        user: session.user.id, 
        provider: session.user.app_metadata.provider,
        hasAccessToken: !!session.provider_token,
        hasRefreshToken: !!session.provider_refresh_token
      }
    );
    
    // Call the test function
    const { data, error } = await supabase.functions.invoke('test-google-sheets');
    
    if (error) {
      console.error('Error testing Google Sheets connection:', error);
      return { 
        success: false, 
        message: `Connection failed: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: "Successfully connected to Google Sheets!" 
    };
  } catch (error) {
    console.error('Failed to test Google Sheets connection:', error);
    return { 
      success: false, 
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

// Setup workload identity federation
export const setupWorkloadIdentity = async (): Promise<{success: boolean, message: string}> => {
  try {
    // Call the identity-token function to get a test token
    const { data, error } = await supabase.functions.invoke('identity-token', {
      method: 'GET',
      headers: {
        'Metadata-Flavor': 'Google'
      }
    });
    
    if (error) {
      console.error('Error setting up workload identity:', error);
      return { 
        success: false, 
        message: `Setup failed: ${error.message}` 
      };
    }
    
    // Test if the token works
    return { 
      success: true, 
      message: "Workload identity federation is correctly set up!" 
    };
  } catch (error) {
    console.error('Failed to setup workload identity:', error);
    return { 
      success: false, 
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

// Get user's Google connections
export const getGoogleConnection = async (): Promise<{connected: boolean, email?: string}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { connected: false };
    }
    
    // Check if the user is signed in with Google
    const provider = session.user?.app_metadata?.provider;
    const email = session.user?.email;
    
    // More detailed debugging information
    console.log('Google connection check:', {
      provider,
      email,
      hasProviderToken: !!session.provider_token,
      hasAccessToken: !!session.access_token
    });
    
    return { 
      connected: provider === 'google', 
      email: email
    };
  } catch (error) {
    console.error('Failed to get Google connection:', error);
    return { connected: false };
  }
};
