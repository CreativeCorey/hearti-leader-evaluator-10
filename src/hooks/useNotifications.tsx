import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const subscribeToNotifications = () => {
    if (!user) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for habit reminders
          if (newNotification.type === 'habit_reminder') {
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendHabitReminder = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Habit Tracker Reminder',
          message: 'Don\'t forget to check in with your habit tracker today! Keep building those positive habits.',
          type: 'habit_reminder'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending habit reminder:', error);
      return false;
    }
  };

  const sendBulkHabitReminders = async () => {
    try {
      // Get all users who haven't been reminded today
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id')
        .neq('role', 'admin');

      if (error) throw error;

      const notifications = users?.map(user => ({
        user_id: user.id,
        title: 'Daily Habit Check-in',
        message: 'Time for your daily habit check-in! Track your progress and keep building positive habits.',
        type: 'habit_reminder'
      })) || [];

      if (notifications.length > 0) {
        const { error: insertError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (insertError) throw insertError;
      }

      return notifications.length;
    } catch (error) {
      console.error('Error sending bulk habit reminders:', error);
      return 0;
    }
  };

  return {
    notifications,
    unreadCount,
    sendHabitReminder,
    sendBulkHabitReminders,
    loadNotifications
  };
};