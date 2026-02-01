import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';
import type { DayOfWeek } from '../types';

interface AnimatedDayPillProps {
    day: DayOfWeek;
    date: Date;
    isSelected: boolean;
    onClick: () => void;
    index: number;
    count?: number;
    showCount?: boolean;
}

export const AnimatedDayPill: React.FC<AnimatedDayPillProps> = ({
    day,
    date,
    isSelected,
    onClick,
    index,
    count = 0,
    showCount = true
}) => {
    const isDayToday = isToday(date);

    const getCountStatus = () => {
        if (count === 0) return 'no-class';
        if (count <= 3) return 'normal';
        return 'busy';
    };

    const countStatus = getCountStatus();

    return (
        <motion.button
            layoutId={`day-pill-${day}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            whileHover={{
                scale: 1.05,
                y: -2
            }}
            whileTap={{
                scale: 0.95
            }}
            className={`
                day-pill relative whitespace-nowrap px-4 py-3 rounded-xl text-sm font-semibold snap-center
                ${isSelected ? 'active' : ''}
                ${isDayToday && !isSelected ? 'ring-2 ring-primary/30' : ''}
                overflow-hidden
            `}
            style={{
                background: isSelected
                    ? 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2))'
                    : 'hsl(var(--muted) / 0.3)'
            }}
        >
            {/* Glow effect */}
            <motion.div
                className="day-pill-glow"
                animate={{
                    opacity: isSelected ? 0.6 : 0
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Shimmer on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0"
                whileHover={{
                    opacity: 1,
                    x: ['-100%', '200%']
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                }}
            />

            <div className="flex flex-col items-center gap-0.5 relative z-10">
                {/* Day name */}
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                    {day.slice(0, 3)}
                </span>

                {/* Date number */}
                <motion.span
                    className={`text-lg font-bold transition-colors ${isSelected ? 'text-primary' : ''}`}
                    animate={{
                        scale: isSelected ? [1, 1.1, 1] : 1,
                        rotate: isSelected ? [0, 2, -2, 0] : 0
                    }}
                    transition={{
                        duration: isSelected ? 0.5 : 0,
                        times: [0, 0.5, 1]
                    }}
                >
                    {format(date, 'd')}
                </motion.span>

                {/* Class count badge */}
                {showCount && count > 0 && (
                    <motion.div
                        initial={{ scale: 0, y: 5 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className={`
                            flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1
                            ${countStatus === 'no-class' ? 'count-badge-no-class' : countStatus === 'normal' ? 'count-badge-normal' : 'count-badge-busy'}
                        `}
                    >
                        {count}
                    </motion.div>
                )}
            </div>

            {/* Today indicator */}
            {isDayToday && !isSelected && (
                <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}

            {/* Today selected badge */}
            {isDayToday && isSelected && (
                <motion.div
                    className="absolute top-1 right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                >
                    <motion.div
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold"
                        animate={{
                            boxShadow: [
                                '0 0 0 0 rgba(139, 47, 201, 0.7)',
                                '0 0 0 8px rgba(139, 47, 201, 0)',
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                    >
                        ✓
                    </motion.div>
                </motion.div>
            )}
        </motion.button>
    );
};
