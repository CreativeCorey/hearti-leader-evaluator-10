import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Shield, Crown, User } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'admin' | 'subscriber' | 'unsubscribed';
  setViewMode: (mode: 'admin' | 'subscriber' | 'unsubscribed') => void;
  userRole: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode, userRole }) => {
  if (userRole !== 'super_admin') {
    return null;
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'subscriber':
        return <Shield className="h-4 w-4" />;
      case 'unsubscribed':
        return <User className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'admin':
        return 'Full admin access with all features unlocked';
      case 'subscriber':
        return 'Premium subscriber experience with paid features';
      case 'unsubscribed':
        return 'Free user experience with premium content locked';
      default:
        return '';
    }
  };

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Crown className="h-5 w-5" />
          Super Admin View Mode
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          Switch between different user perspectives to test the experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getModeIcon(viewMode)}
            <span className="font-medium text-amber-800 dark:text-amber-200">
              Current View:
            </span>
          </div>
          <Select value={viewMode} onValueChange={(value: 'admin' | 'subscriber' | 'unsubscribed') => setViewMode(value)}>
            <SelectTrigger className="w-48 border-amber-300 focus:ring-amber-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Admin View
                </div>
              </SelectItem>
              <SelectItem value="subscriber">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Subscriber View
                </div>
              </SelectItem>
              <SelectItem value="unsubscribed">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Unsubscribed View
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          {getModeDescription(viewMode)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ViewModeToggle;