import { useState, useCallback } from 'react';
import { checkRateLimit } from '@/utils/input-validation';
import { useToast } from './use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkAndEnforceRateLimit = useCallback((
    action: string, 
    maxRequests: number = 10, 
    windowMs: number = 60000
  ): boolean => {
    if (!user) {
      // Don't allow unauthenticated users to make requests
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
      return false;
    }

    const identifier = user.id;
    const isAllowed = checkRateLimit(identifier, maxRequests, windowMs);

    if (!isAllowed) {
      setIsRateLimited(true);
      toast({
        title: "Too many requests",
        description: `Please wait before trying again. Limit: ${maxRequests} requests per ${windowMs / 60000} minute(s).`,
        variant: "destructive"
      });
      
      // Reset rate limit flag after window expires
      setTimeout(() => {
        setIsRateLimited(false);
      }, windowMs);
      
      return false;
    }

    return true;
  }, [user, toast]);

  return {
    isRateLimited,
    checkAndEnforceRateLimit
  };
};