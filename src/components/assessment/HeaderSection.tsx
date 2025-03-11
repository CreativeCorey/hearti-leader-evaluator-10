
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types';

interface HeaderSectionProps {
  profile: UserProfile | null;
  isSupabaseEnabled: boolean;
  handleToggleSupabase: (enabled: boolean) => void;
  googleConnection: { connected: boolean; email?: string };
  isMobile: boolean;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  profile,
  isSupabaseEnabled,
  handleToggleSupabase,
  googleConnection,
  isMobile
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 sm:gap-6 mb-6 sm:mb-8 w-full pt-4">
      <div className="w-full text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">HEARTI™ Leadership Assessment</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Measure your growth in Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0 justify-center md:justify-end">
        {/* Storage toggle and Cloud/Local indicators hidden as requested */}
        
        {profile && googleConnection.connected && (
          <Badge variant="outline" className="p-1 sm:p-2 text-xs">
            {isMobile ? googleConnection.email?.split('@')[0] : googleConnection.email}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
