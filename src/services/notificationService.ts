
// A service to handle push notifications for the habit tracker
import { toast } from '@/hooks/use-toast';

// Check if the browser supports notifications
const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    toast({
      title: "Notifications not supported",
      description: "Your browser doesn't support notifications.",
      variant: "destructive"
    });
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Schedule a notification
export const scheduleHabitNotification = (habitTitle: string, frequency: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  const notificationKey = `habit-notification-${habitTitle}`;
  
  // Store notification settings in localStorage
  localStorage.setItem(notificationKey, JSON.stringify({
    title: habitTitle,
    frequency,
    enabled: true,
    lastNotified: new Date().toISOString()
  }));
  
  toast({
    title: "Reminder scheduled",
    description: `You'll receive reminders for "${habitTitle}" ${frequency}.`,
  });
  
  return true;
};

// Cancel a notification
export const cancelHabitNotification = (habitTitle: string) => {
  const notificationKey = `habit-notification-${habitTitle}`;
  localStorage.removeItem(notificationKey);
};

// Send a notification
export const sendNotification = (title: string, body: string) => {
  if (!isNotificationSupported()) return false;
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/lovable-uploads/f52625fd-8dcf-4e6f-8753-456776fcdaf9.png'
    });
    return true;
  }
  
  return false;
};

// Check for pending notifications and send them
export const checkPendingNotifications = () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  
  const now = new Date();
  
  // Get all habit notifications from localStorage
  Object.keys(localStorage).forEach(key => {
    if (!key.startsWith('habit-notification-')) return;
    
    try {
      const notificationData = JSON.parse(localStorage.getItem(key) || '{}');
      if (!notificationData.enabled) return;
      
      const lastNotified = new Date(notificationData.lastNotified);
      const shouldNotify = shouldSendNotification(lastNotified, notificationData.frequency, now);
      
      if (shouldNotify) {
        sendNotification(
          'HEARTI™ Habit Reminder', 
          `Don't forget to practice "${notificationData.title}" today!`
        );
        
        // Update last notified time
        notificationData.lastNotified = now.toISOString();
        localStorage.setItem(key, JSON.stringify(notificationData));
      }
    } catch (error) {
      console.error('Error checking notification:', error);
    }
  });
};

// Helper to determine if notification should be sent based on frequency
const shouldSendNotification = (lastNotified: Date, frequency: string, now: Date): boolean => {
  const hours = Math.floor((now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60));
  
  switch (frequency) {
    case 'daily':
      // Notify once per day if last notification was more than 20 hours ago
      return hours >= 20 && now.getHours() >= 8 && now.getHours() <= 20;
    
    case 'weekly':
      // Notify once per week if last notification was more than 6 days ago
      return hours >= 144 && now.getDay() === 1; // Monday
    
    case 'monthly':
      // Notify once per month if last notification was more than 27 days ago
      return hours >= 648 && now.getDate() === 1; // First day of month
    
    default:
      return false;
  }
};

// Initialize notification check interval on app start
export const initNotifications = () => {
  // Check for notifications every hour
  setInterval(checkPendingNotifications, 60 * 60 * 1000);
  
  // Also check immediately when the app starts
  checkPendingNotifications();
};
