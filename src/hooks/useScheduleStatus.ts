import { useState, useEffect } from 'react';
import { useTimetable } from './useTimetable';
import type { DayOfWeek } from '../types';
import { isWithinInterval, parse, getDay } from 'date-fns';

import { useMemo } from 'react';

export function useScheduleStatus() {
    const { entries } = useTimetable();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { currentClass, nextClass } = useMemo(() => {
        // 1. Get current day name
        const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayName = days[getDay(now)];

        // 2. Filter entries for today
        const todayEntries = entries.filter(e => e.days.includes(currentDayName));

        // 3. Find current class
        const current = todayEntries.find(entry => {
            const start = parse(entry.startTime, 'HH:mm', now);
            const end = parse(entry.endTime, 'HH:mm', now);
            return isWithinInterval(now, { start, end });
        }) || null;

        // 4. Find next class
        // Sort by start time first
        const sortedToday = [...todayEntries].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );

        const next = sortedToday.find(entry => {
            const start = parse(entry.startTime, 'HH:mm', now);
            return now < start;
        }) || null;

        return { currentClass: current, nextClass: next };
    }, [now, entries]);

    return { currentClass, nextClass, now };
}
