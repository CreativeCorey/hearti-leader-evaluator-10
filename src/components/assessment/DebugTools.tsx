
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ensureUserProfileExists } from '@/utils/supabase/profiles';

const DebugTools: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="mt-4 p-4 border border-red-300 rounded bg-red-50">
      <h3 className="text-red-700 font-medium">Debug Tools</h3>
      <p className="text-sm text-red-600 mb-2">Only visible in development mode</p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={async () => {
            const anonId = localStorage.getItem('hearti-anonymous-user-id');
            console.log("Current anonymous ID:", anonId);
            
            if (anonId) {
              const success = await ensureUserProfileExists(anonId);
              console.log("Profile creation result:", success);
              toast({
                title: success ? "Profile Created" : "Profile Creation Failed",
                description: `Attempted to create profile for ${anonId}`,
                variant: success ? "default" : "destructive"
              });
            }
          }}
        >
          Debug: Create Profile
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            localStorage.removeItem('hearti-anonymous-user-id');
            toast({
              title: "Anonymous ID Cleared",
              description: "You'll get a new anonymous ID on refresh",
            });
          }}
        >
          Clear Anonymous ID
        </Button>
      </div>
    </div>
  );
};

export default DebugTools;
