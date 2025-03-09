
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
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HEARTI™ Leadership Assessment</h1>
        <p className="text-muted-foreground mt-1">
          Measure your growth in Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity
        </p>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <Toggle
          pressed={isSupabaseEnabled}
          onPressedChange={handleToggleSupabase}
          className="data-[state=on]:bg-blue-500 px-4"
        >
          {isSupabaseEnabled ? 'Cloud Storage (Google Sheets)' : 'Local Storage'}
        </Toggle>
        
        {profile && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="p-2">
              {googleConnection.connected ? googleConnection.email : (profile.email || 'Anonymous user')}
            </Badge>
            
            <Link to="/auth">
              <Button variant="ghost" size="sm">
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
