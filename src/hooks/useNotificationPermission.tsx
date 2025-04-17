
import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/services/notificationService';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  
  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      return;
    }
    
    setPermission(Notification.permission);
  }, []);
  
  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
    }
    return granted;
  };
  
  return {
    permission,
    requestPermission,
    isSupported: permission !== 'unsupported'
  };
};
