import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format, isToday } from 'date-fns';
import type { DayOfWeek, TimeTableEntry } from '../types';
import { useTimetable } from '../hooks/useTimetable';

interface WeekOverviewProps {
    selectedDay: DayOfWeek;
    onDaySelect: (day: DayOfWeek) => void;
}

export const WeekOverview: React.FC<WeekOverviewProps> = ({ selectedDay, onDaySelect }) => {
    const { entries } = useTimetable();
    const [hoveredDay, setHoveredDay] = useState<DayOfWeek | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getDayCount = (day: DayOfWeek) => {
        return entries.filter((e: TimeTableEntry) => e.days.includes(day)).length;
    };

    const getDayStatus = (count: number) => {
        if (count === 0) return 'free';
        if (count <= 3) return 'partial';
        return 'full';
    };

    const getDayDate = (day: DayOfWeek) => {
        const today = new Date();
        const dayIndex = DAYS.indexOf(day);
        const todayIndex = DAYS.indexOf(format(today, 'EEEE') as DayOfWeek);
        const diff = dayIndex - todayIndex;
        const date = new Date(today);
        date.setDate(date.getDate() + diff);
        return date;
    };

    const getStatusColors = (status: string) => {
        switch (status) {
            case 'free':
                return {
                    bg: 'bg-emerald-500/20',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                    hover: 'hover:bg-emerald-500/30'
                };
            case 'partial':
                return {
                    bg: 'bg-amber-500/20',
                    text: 'text-amber-400',
                    border: 'border-amber-500/30',
                    hover: 'hover:bg-amber-500/30'
                };
            case 'full':
                return {
                    bg: 'bg-red-500/20',
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    hover: 'hover:bg-red-500/30'
                };
            default:
                return {
                    bg: 'bg-muted/20',
                    text: 'text-muted-foreground',
                    border: 'border-border',
                    hover: 'hover:bg-muted/30'
                };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 space-y-3"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <h4 className="text-sm font-bold text-foreground">Week Overview</h4>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </motion.button>
            </div>

            {/* Week cards */}
            <AnimatePresence>
                <motion.div
                    className={`
                        flex gap-2 overflow-x-auto pb-2 no-scrollbar transition-all duration-500
                        ${isExpanded ? 'justify-start' : 'justify-center'}
                    `}
                    initial={false}
                >
                    {DAYS.map((day, index) => {
                        const dayDate = getDayDate(day);
                        const count = getDayCount(day);
                        const status = getDayStatus(count);
                        const isSelected = selectedDay === day;
                        const isDayToday = isToday(dayDate);
                        const colors = getStatusColors(status);

                        return (
                            <motion.button
                                key={day}
                                layoutId={`week-overview-${day}`}
                                onClick={() => onDaySelect(day)}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    week-overview-card relative flex-shrink-0 p-3 rounded-xl min-w-[80px] text-center
                                    ${isSelected
                                        ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 shadow-lg shadow-primary/20'
                                        : `${colors.bg} border ${colors.border} ${colors.hover}`
                                    }
                                    transition-all duration-300
                                `}
                            >
                                {/* Selected glow */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute inset-0 rounded-xl -z-10"
                                        animate={{
                                            opacity: [0.3, 0.5, 0.3],
                                            scale: [1, 1.02, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2))',
                                            filter: 'blur(8px)'
                                        }}
                                    />
                                )}

                                {/* Day name */}
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                                    {day.slice(0, 3)}
                                </div>

                                {/* Date number */}
                                <motion.div
                                    className={`text-2xl font-bold ${isSelected ? 'text-primary' : colors.text}`}
                                    animate={{
                                        rotate: isDayToday && !isSelected ? [0, 5, -5, 0] : 0
                                    }}
                                    transition={{
                                        duration: isDayToday ? 3 : 0,
                                        repeat: isDayToday ? Infinity : 0,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {format(dayDate, 'd')}
                                </motion.div>

                                {/* Status dots */}
                                <div className="flex justify-center gap-1 mt-2">
                                    {count > 0 ? (
                                        Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full week-overview-dot ${status}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.05 + 0.2 + i * 0.05 }}
                                            />
                                        ))
                                    ) : (
                                        <motion.div
                                            className="text-xs text-muted-foreground"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 + 0.3 }}
                                        >
                                            Free
                                        </motion.div>
                                    )}
                                </div>

                                {/* Today indicator */}
                                {isDayToday && !isSelected && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            boxShadow: [
                                                '0 0 0 0 rgba(139, 47, 201, 0.7)',
                                                '0 0 0 4px rgba(139, 47, 201, 0)',
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity
                                        }}
                                    />
                                )}

                                {/* Count badge on hover */}
                                <AnimatePresence>
                                    {hoveredDay === day && count > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                                        >
                                            <div className={`
                                                px-2 py-0.5 rounded-full text-[10px] font-bold
                                                ${isSelected ? 'bg-primary text-white' : `${colors.bg} ${colors.text}`}
                                            `}
                                            style={{
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            >
                                                {count} {count === 1 ? 'class' : 'classes'}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Free</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Partial</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Full</span>
                </div>
            </div>
        </motion.div>
    );
};
