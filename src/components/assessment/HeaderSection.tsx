
import React from 'react';
import { Link } from 'react-router-dom';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">HEARTI™ Leadership Assessment</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Measure your growth in Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
        <Toggle
          pressed={isSupabaseEnabled}
          onPressedChange={handleToggleSupabase}
          className="data-[state=on]:bg-blue-500 px-2 sm:px-4 text-xs sm:text-sm h-7 sm:h-auto"
        >
          {isMobile ? (isSupabaseEnabled ? 'Cloud' : 'Local') : (isSupabaseEnabled ? 'Cloud Storage' : 'Local Storage')}
        </Toggle>
        
        {profile && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="p-1 sm:p-2 text-xs">
              {googleConnection.connected ? 
                (isMobile ? googleConnection.email?.split('@')[0] : googleConnection.email) : 
                (profile.email || 'Anonymous')}
            </Badge>
            
            <Link to="/auth">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs sm:text-sm ${isMobile ? 'h-7 py-1 px-2' : 'h-9'}`}
              >
                {profile.email ? 'Account' : 'Sign In'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;
