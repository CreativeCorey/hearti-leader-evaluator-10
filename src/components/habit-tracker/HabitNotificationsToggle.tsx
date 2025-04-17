
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { scheduleHabitNotification, cancelHabitNotification } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface HabitNotificationsToggleProps {
  habitTitle: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

const HabitNotificationsToggle: React.FC<HabitNotificationsToggleProps> = ({ 
  habitTitle, 
  frequency,
  className = '' 
}) => {
  const { permission, requestPermission, isSupported } = useNotificationPermission();
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(false);
  
  React.useEffect(() => {
    // Check if this habit has notifications enabled
    try {
      const notificationKey = `habit-notification-${habitTitle}`;
      const savedData = localStorage.getItem(notificationKey);
      if (savedData) {
        const { enabled } = JSON.parse(savedData);
        setEnabled(enabled);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, [habitTitle]);
  
  const handleToggle = async (newState: boolean) => {
    if (!isSupported) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return;
    }
    
    if (newState && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title: "Permission denied",
          description: "Please allow notifications in your browser settings.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (newState) {
      scheduleHabitNotification(habitTitle, frequency);
    } else {
      cancelHabitNotification(habitTitle);
      toast({
        title: "Notifications disabled",
        description: `You won't receive reminders for "${habitTitle}".`,
      });
    }
    
    setEnabled(newState);
  };
  
  // If notifications aren't supported, don't render anything
  if (!isSupported) return null;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {permission !== 'granted' ? (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={() => requestPermission()}
        >
          <Bell className="h-3 w-3" />
          Enable Reminders
        </Button>
      ) : (
        <>
          {enabled ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
          <Switch 
            checked={enabled} 
            onCheckedChange={handleToggle} 
            aria-label="Toggle habit notifications"
          />
          <span className="text-xs text-muted-foreground">
            {enabled ? 'Reminders on' : 'Reminders off'}
          </span>
        </>
      )}
    </div>
  );
};

export default HabitNotificationsToggle;
