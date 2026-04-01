import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import type { TimeTableEntry, DayOfWeek } from '../types';
import { ClassCard } from './ClassCard';
import { LiveBadge } from './LiveBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Calendar, Plus } from 'lucide-react';
import { format, isToday, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface WeekViewProps {
    onEntryClick: (entry: TimeTableEntry) => void;
    onAddEntry?: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeekView: React.FC<WeekViewProps> = ({ onEntryClick, onAddEntry }) => {
    const { entries } = useTimetable();
    const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>(() => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
        return DAYS.includes(today) ? today : 'Monday';
    });
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [previousDay, setPreviousDay] = useState<DayOfWeek | null>(null);
    const [showWeekOverview, setShowWeekOverview] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    }, []);

    useEffect(() => {
        checkScroll();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll, { passive: true });
        }
        window.addEventListener('resize', checkScroll, { passive: true });

        return () => {
            if (ref) {
                ref.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    // Get date for selected day based on current week start
    const getDayDate = (day: DayOfWeek) => {
        const dayIndex = DAYS.indexOf(day);
        return addDays(currentWeekStart, dayIndex);
    };

    // Quick select functions
    const selectToday = () => {
        const today = new Date();
        const dayName = format(today, 'EEEE') as DayOfWeek;
        setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
        if (DAYS.includes(dayName)) {
            setSelectedDay(dayName);
        }
    };

    const selectYesterday = () => {
        // Calculate the actual date of the currently selected day
        const currentSelectedDate = getDayDate(selectedDay);
        const yesterday = addDays(currentSelectedDate, -1);
        const dayName = format(yesterday, 'EEEE') as DayOfWeek;

        // Update week start if we moved to previous week
        setCurrentWeekStart(startOfWeek(yesterday, { weekStartsOn: 1 }));

        if (DAYS.includes(dayName)) {
            setSelectedDay(dayName);
        }
    };

    const selectTomorrow = () => {
        // Calculate the actual date of the currently selected day
        const currentSelectedDate = getDayDate(selectedDay);
        const tomorrow = addDays(currentSelectedDate, 1);
        const dayName = format(tomorrow, 'EEEE') as DayOfWeek;

        // Update week start if we moved to next week
        setCurrentWeekStart(startOfWeek(tomorrow, { weekStartsOn: 1 }));

        if (DAYS.includes(dayName)) {
            setSelectedDay(dayName);
        }
    };

    // Scroll to day
    const scrollToDay = (day: DayOfWeek) => {
        if (scrollRef.current) {
            const dayIndex = DAYS.indexOf(day);
            const dayElements = scrollRef.current.children;
            if (dayElements[dayIndex]) {
                dayElements[dayIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    };

    // Memoized — only recomputes when entries or selectedDay changes, not on every render
    const dayEntries = useMemo(() =>
        entries
            .filter(e => e.days.includes(selectedDay))
            .sort((a, b) => a.startTime.localeCompare(b.startTime)),
        [entries, selectedDay]
    );

    const selectedDate = useMemo(() => getDayDate(selectedDay), [selectedDay, currentWeekStart]);
    const isTodaySelected = isToday(selectedDate);

    // Helper — pure function, no deps, defined once
    const getClassCountStatus = (count: number) => {
        if (count === 0) return 'no-class';
        if (count <= 3) return 'normal';
        return 'busy';
    };

    // Precomputed count per day — replaces 7x entries.filter() calls inside JSX map
    const dayCountMap = useMemo(() =>
        Object.fromEntries(
            DAYS.map(day => [day, entries.filter(e => e.days.includes(day)).length])
        ) as Record<DayOfWeek, number>,
        [entries]
    );

    // Week overview — now memoized, only recomputes when entries or week changes
    const weekOverview = useMemo(() => {
        const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

        return weekDays.map(date => {
            const dayName = format(date, 'EEEE') as DayOfWeek;
            const count = dayCountMap[dayName] ?? 0;
            return {
                day: dayName,
                date,
                count,
                status: getClassCountStatus(count)
            };
        });
    }, [entries, currentWeekStart, dayCountMap]);

    // Handle day selection with animation
    const handleDaySelect = (day: DayOfWeek) => {
        setPreviousDay(selectedDay);
        setSelectedDay(day);
        scrollToDay(day);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Week Overview Toggle */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <button
                    onClick={() => setShowWeekOverview(!showWeekOverview)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors w-full sm:w-auto justify-between sm:justify-start"
                >
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span className="text-sm font-medium">Week Overview</span>
                    </div>
                    <motion.div
                        animate={{ rotate: showWeekOverview ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <ChevronRight size={14} />
                    </motion.div>
                </button>

                {/* Quick Select Buttons */}
                <div className="flex items-center gap-2 justify-between sm:justify-end">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={selectYesterday}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                        Yesterday
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={selectToday}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                        Today
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={selectTomorrow}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                        Tomorrow
                    </motion.button>
                </div>
            </motion.div>

            {/* Week Overview Mini Cards */}
            <AnimatePresence>
                {showWeekOverview && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {weekOverview.map((dayData, index) => {
                                const isThisDay = selectedDay === dayData.day;
                                const isDayToday = isToday(dayData.date);
                                return (
                                    <motion.button
                                        key={dayData.day}
                                        onClick={() => handleDaySelect(dayData.day)}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`
                                            week-overview-card flex-shrink-0 p-3 rounded-xl min-w-[70px] text-center
                                            ${isThisDay
                                                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/50'
                                                : 'bg-black/5 dark:bg-white/5 border border-transparent hover:border-border'
                                            }
                                            transition-all duration-300
                                        `}
                                    >
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                            {dayData.day.slice(0, 3)}
                                        </div>
                                        <div className={`text-lg font-bold ${isThisDay ? 'text-primary' : 'text-foreground'}`}>
                                            {format(dayData.date, 'd')}
                                        </div>
                                        <div className="flex justify-center gap-0.5 mt-2">
                                            {dayData.count > 0 && (
                                                Array.from({ length: Math.min(dayData.count, 3) }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`week-overview-dot w-1.5 h-1.5 rounded-full ${dayData.status === 'no-class' ? 'free' : dayData.status === 'normal' ? 'partial' : 'full'}`}
                                                    />
                                                ))
                                            )}
                                        </div>
                                        {isDayToday && !isThisDay && (
                                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Horizontal Day Selector */}
            <div className="relative group">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x px-1"
                >
                    {DAYS.map((day, index) => {
                        const dayDate = getDayDate(day);
                        const isSelected = selectedDay === day;
                        const isDayToday = isToday(dayDate);
                        const dayCount = dayCountMap[day] ?? 0;
                        const countStatus = getClassCountStatus(dayCount);

                        return (
                            <motion.button
                                key={day}
                                layoutId={`day-${day}`}
                                onClick={() => handleDaySelect(day)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    day-pill relative whitespace-nowrap px-5 py-3 rounded-xl text-sm font-semibold snap-center
                                    ${isSelected ? 'active' : ''}
                                    ${isDayToday && !isSelected ? 'ring-2 ring-primary/30' : ''}
                                `}
                            >
                                <div className="day-pill-glow" />
                                <div className="flex flex-col items-center gap-0.5 relative z-10">
                                    <span className={`text-xs uppercase tracking-wide ${isSelected ? 'opacity-90 text-white' : 'opacity-70'}`}>
                                        {day.slice(0, 3)}
                                    </span>
                                    <motion.span
                                        className={`text-xl font-bold ${isSelected ? 'text-white' : ''}`}
                                        animate={{
                                            scale: isSelected ? [1, 1.1, 1] : 1
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            times: [0, 0.5, 1]
                                        }}
                                    >
                                        {format(dayDate, 'd')}
                                    </motion.span>
                                    {dayCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`
                                                flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1
                                                ${countStatus === 'no-class' ? 'count-badge-no-class' : countStatus === 'normal' ? 'count-badge-normal' : 'count-badge-busy'}
                                            `}
                                        >
                                            {dayCount}
                                        </motion.div>
                                    )}
                                </div>
                                {isDayToday && !isSelected && (
                                    <motion.div
                                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [1, 0.7, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                )}
                                {isDayToday && isSelected && (
                                    <motion.div
                                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            boxShadow: [
                                                '0 0 0 0 rgba(139, 47, 201, 0.7)',
                                                '0 0 0 6px rgba(139, 47, 201, 0)',
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Left Scroll Hint */}
                <AnimatePresence>
                    {canScrollLeft && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-background z-10"
                        >
                            <motion.div
                                animate={{ x: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-primary"
                            >
                                <ChevronLeft size={20} />
                            </motion.div>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Right Scroll Hint */}
                <AnimatePresence>
                    {canScrollRight && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-background z-10"
                        >
                            <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-primary"
                            >
                                <ChevronRight size={20} />
                            </motion.div>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-[300px] day-transition">
                {/* Header with enhanced date display */}
                <motion.div
                    key={`header-${selectedDay}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-between mb-6 px-1"
                >
                    <div className="flex items-center gap-4">
                        <div>
                            <motion.h3
                                className="text-3xl font-bold text-foreground flex items-center gap-2"
                                animate={{
                                    scale: previousDay !== selectedDay ? [1, 1.05, 1] : 1
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {selectedDay}
                                {isTodaySelected && <LiveBadge variant="today" />}
                            </motion.h3>
                            <motion.p
                                key={selectedDate.toISOString()}
                                className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5"
                                initial={{ rotateX: -90, opacity: 0 }}
                                animate={{ rotateX: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <Calendar size={14} />
                                {format(selectedDate, 'MMMM d, yyyy')}
                            </motion.p>
                        </div>
                    </div>

                    {/* Animated Class Count Badge */}
                    <motion.div
                        key={`count-${dayEntries.length}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="text-right"
                    >
                        <motion.div
                            className={`
                                relative inline-flex items-center justify-center w-16 h-16 rounded-2xl
                                ${getClassCountStatus(dayEntries.length) === 'no-class' ? 'count-badge-no-class' : getClassCountStatus(dayEntries.length) === 'normal' ? 'count-badge-normal' : 'count-badge-busy'}
                                ${dayEntries.length > 0 ? isTodaySelected ? 'badge-pulse' : '' : ''}
                            `}
                        >
                            {isTodaySelected && dayEntries.length > 0 && (
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 opacity-20"
                                        animate={{
                                            x: ['-100%', '100%']
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent" />
                                    </motion.div>
                                </div>
                            )}
                            <motion.span
                                className="text-2xl font-bold relative z-10"
                                key={dayEntries.length}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                {dayEntries.length}
                            </motion.span>
                        </motion.div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                            {dayEntries.length === 1 ? 'Class' : 'Classes'}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Entries List */}
                <div className="space-y-3 pb-24">
                    <AnimatePresence mode="popLayout">
                        {dayEntries.length > 0 ? (
                            dayEntries.map((entry, index) => (
                                <motion.div
                                    key={`${entry.id}-${selectedDay}`}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        ease: 'easeOut',
                                    }}
                                    layout
                                >
                                    <ClassCard
                                        entry={entry}
                                        status="future"
                                        onClick={() => onEntryClick(entry)}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                key={`empty-${selectedDay}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="glass-card p-8 md:p-12 rounded-xl flex flex-col items-center justify-center text-center border-dashed border-border hover:border-primary/30 transition-colors"
                            >
                                <motion.div
                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 breathing-bg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <Calendar className="text-primary w-10 h-10" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    No classes scheduled
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Enjoy your free time or plan ahead!
                                </p>
                                {onAddEntry && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onAddEntry}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                                    >
                                        <Plus size={18} />
                                        Add Class
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
