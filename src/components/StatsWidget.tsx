import React, { useMemo } from 'react';
import { useFocus } from '../context/FocusContext';
import { useTimetable } from '../context/TimetableContext';
import { motion } from 'framer-motion';
import { PieChart, Clock, Zap } from 'lucide-react';
import { differenceInMinutes, parse, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const StatsWidget: React.FC = () => {
    const { sessionHistory } = useFocus();
    const { entries } = useTimetable();

    // Calculate Today's Stats
    const stats = useMemo(() => {
        const now = new Date();
        const start = startOfDay(now);
        const end = endOfDay(now);

        // 1. Study Time (from Focus Sessions)
        const todaySessions = sessionHistory.filter(s =>
            isWithinInterval(new Date(s.startTime), { start, end })
        );
        const studyMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);

        // 2. Scheduled Class Time (from Timetable)
        // This is tricky because entries are recurring. We need to find today's entries.
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }) as any;
        const todayClasses = entries.filter(e => e.days.includes(dayName));

        let classMinutes = 0;
        todayClasses.forEach(e => {
            const s = parse(e.startTime, 'HH:mm', now);
            const en = parse(e.endTime, 'HH:mm', now);
            classMinutes += differenceInMinutes(en, s);
        });

        // 3. Free Time (Total awake time - (Study + Class))
        // Assuming awake time 16 hours? Or simply reference to 24h?
        // Let's stick to "Productive Time" vs "Free Time" isn't exact science here.
        // Let's just show "Focus Time" and "Class Time" and maybe a total productivity score.

        return {
            focusTime: studyMinutes,
            classTime: classMinutes,
            sessions: todaySessions.length
        };
    }, [sessionHistory, entries]);

    const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <PieChart className="text-secondary" />
                <span>Daily Stats</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Focus Time Card */}
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                        <Zap size={14} className="text-yellow-400" />
                        <span>Focus Time</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatTime(stats.focusTime)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {stats.sessions} sessions completed
                    </div>
                </div>

                {/* Class Time Card */}
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                        <Clock size={14} className="text-blue-400" />
                        <span>Class Time</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {formatTime(stats.classTime)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        scheduled for today
                    </div>
                </div>
            </div>

            {/* Total progress bar approx (Goal: 8 hours?) */}
            <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Productivity Goal (6h)</span>
                    <span>{Math.min(100, Math.round(((stats.focusTime + stats.classTime) / 360) * 100))}%</span>
                </div>
                <div className="h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((stats.focusTime + stats.classTime) / 360) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-secondary to-primary"
                    />
                </div>
            </div>
        </div>
    );
};
