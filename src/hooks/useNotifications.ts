import { useEffect, useCallback, useRef } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useScheduleStatus } from './useScheduleStatus';
import { differenceInMinutes, parse } from 'date-fns';

export function useNotifications() {
  const { settings } = useTimetable();
  const { nextClass, now } = useScheduleStatus();
  const lastNotifiedRef = useRef<string | null>(null);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted' && settings.notificationsEnabled) {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png', // Standard PWA icon path usually
        vibrate: [200, 100, 200]
      } as any);
    }
  }, [settings.notificationsEnabled]);

  // Check for upcoming classes
  useEffect(() => {
    if (!settings.notificationsEnabled || !nextClass) return;

    const start = parse(nextClass.startTime, 'HH:mm', now);
    const diff = differenceInMinutes(start, now);

    // Notify 5 minutes before
    // We use a key to ensure we only notify once per class instance per day
    if (diff <= 5 && diff >= 0) {
      const key = `${nextClass.id}-${now.getDate()}-5min`;

      if (lastNotifiedRef.current !== key) {
        sendNotification(
          `Upcoming: ${nextClass.subject}`,
          `Class starts in ${diff} minutes at ${nextClass.location}`
        );
        lastNotifiedRef.current = key;
      }
    }
  }, [nextClass, now, settings.notificationsEnabled, sendNotification]);

  return { requestPermission, sendNotification };
}
