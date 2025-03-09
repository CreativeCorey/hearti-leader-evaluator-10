
import { useState, useEffect } from 'react';
import { useToast } from "./use-toast";
import { 
  signInWithGoogle, 
  testGoogleSheetsConnection, 
  setupWorkloadIdentity, 
  getGoogleConnection 
} from '../utils/googleAuth';

export const useGoogleIntegration = () => {
  const { toast } = useToast();
  const [testingSheets, setTestingSheets] = useState(false);
  const [googleConnection, setGoogleConnection] = useState<{connected: boolean, email?: string}>({ connected: false });
  const [configuringWorkloadIdentity, setConfiguringWorkloadIdentity] = useState(false);
  
  useEffect(() => {
    const checkGoogleConnection = async () => {
      // Check Google connection
      const connection = await getGoogleConnection();
      setGoogleConnection(connection);
    };
    
    checkGoogleConnection();
  }, []);
  
  const handleGoogleSignIn = async () => {
    try {
      toast({
        title: "Initiating Google Sign In",
        description: "Redirecting to Google Authentication...",
      });
      
      const success = await signInWithGoogle();
      
      if (!success) {
        toast({
          title: "Google Sign In Failed",
          description: "Could not initiate Google sign in. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast({
        title: "Sign In Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleConfigureWorkloadIdentity = async () => {
    if (!googleConnection.connected) {
      toast({
        title: "Not Connected to Google",
        description: "You need to sign in with Google first.",
        variant: "destructive",
      });
      return;
    }
    
    setConfiguringWorkloadIdentity(true);
    
    try {
      // First test Google Sheets connection
      const result = await setupWorkloadIdentity();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Configuration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error configuring workload identity:', error);
      toast({
        title: "Configuration Error",
        description: "An unexpected error occurred while configuring workload identity.",
        variant: "destructive",
      });
    } finally {
      setConfiguringWorkloadIdentity(false);
    }
  };
  
  const testGoogleSheets = async () => {
    setTestingSheets(true);
    try {
      // Test the Google Sheets connection
      const result = await testGoogleSheetsConnection();
      
      if (result.success) {
        toast({
          title: "Google Sheets Connection Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Google Sheets Test Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during Google Sheets test:', error);
      toast({
        title: "Test Error",
        description: "An unexpected error occurred during the test.",
        variant: "destructive",
      });
    } finally {
      setTestingSheets(false);
    }
  };

  return {
    googleConnection,
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets,
    setTestingSheets
  };
};
