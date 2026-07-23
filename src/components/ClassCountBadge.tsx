import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayOfWeek, TimeTableEntry } from '../types';
import { useTimetable } from '../hooks/useTimetable';

interface ClassCountBadgeProps {
    day: DayOfWeek;
    isToday: boolean;
}

export const ClassCountBadge: React.FC<ClassCountBadgeProps> = ({ day, isToday }) => {
    const { entries } = useTimetable();
    const count = entries.filter((e: TimeTableEntry) => e.days.includes(day)).length;

    const getStatus = () => {
        if (count === 0) return 'no-class';
        if (count <= 3) return 'normal';
        return 'busy';
    };

    const getStatusColors = () => {
        switch (getStatus()) {
            case 'no-class':
                return {
                    bg: 'bg-emerald-500/20',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                    icon: '🌴'
                };
            case 'normal':
                return {
                    bg: 'bg-amber-500/20',
                    text: 'text-amber-400',
                    border: 'border-amber-500/30',
                    icon: '📚'
                };
            case 'busy':
                return {
                    bg: 'bg-red-500/20',
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    icon: '🔥'
                };
        }
    };

    const status = getStatusColors();

    return (
        <motion.div
            key={`badge-${day}-${count}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="text-right"
        >
            <motion.div
                className={`
                    relative inline-flex items-center justify-center w-16 h-16 rounded-2xl
                    ${status.bg} ${status.border} border
                    ${isToday && count > 0 ? 'badge-pulse' : ''}
                    ${getStatus() === 'busy' ? 'animate-pulse-glow' : ''}
                `}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Shimmer effect for today */}
                {isToday && count > 0 && (
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

                {/* Count number with flip animation */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={count}
                        className={`text-2xl font-bold ${status.text} relative z-10`}
                        initial={{ y: -20, opacity: 0, rotateX: -90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: 20, opacity: 0, rotateX: 90 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {count}
                    </motion.span>
                </AnimatePresence>

                {/* Icon indicator */}
                <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background flex items-center justify-center text-xs shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                    {status.icon}
                </motion.div>
            </motion.div>

            {/* Label with tooltip hint */}
            <div className="mt-1">
                <motion.div
                    className="text-xs text-muted-foreground uppercase tracking-wide"
                    animate={{
                        opacity: [1, 0.7, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {count === 1 ? 'Class' : 'Classes'}
                </motion.div>
                {getStatus() === 'busy' && (
                    <motion.div
                        className="text-[10px] text-red-400 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Busy day!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
