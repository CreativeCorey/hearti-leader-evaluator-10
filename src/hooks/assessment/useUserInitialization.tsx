
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ensureUserExists } from '@/utils/localStorage';

export const useUserInitialization = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string, organizationId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user
    const initUser = async () => {
      console.log("Initializing user, checking if exists...");
      try {
        const user = await ensureUserExists();
        setCurrentUser({
          id: user.id,
          organizationId: user.organizationId
        });
      } catch (error) {
        console.error("Failed to get user:", error);
        toast({
          title: "Error",
          description: "Failed to initialize user. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    initUser();
  }, [toast]);

  return {
    currentUser,
    loading
  };
};
