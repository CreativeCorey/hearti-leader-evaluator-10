
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ensureUserProfileExists } from '@/utils/supabase/profiles';

const DebugTools: React.FC = () => {
  // Return null to hide the debug tools
  return null;
};

export default DebugTools;
