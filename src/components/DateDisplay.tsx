import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { format, isToday } from 'date-fns';

interface DateDisplayProps {
    date: Date;
    dayName: string;
    showTime?: boolean;
    showProgress?: boolean;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
    date,
    dayName,
    showTime = true,
    showProgress = true
}) => {
    const isTodayDate = isToday(date);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const dayProgress = isTodayDate
        ? ((now.getTime() - startOfDay.getTime()) / (endOfDay.getTime() - startOfDay.getTime())) * 100
        : 0;

    return (
        <div className="space-y-2">
            {/* Main date display */}
            <div className="flex items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <motion.h3
                        className="text-3xl font-bold text-foreground flex items-center gap-2"
                        animate={{
                            scale: isTodayDate ? [1, 1.02, 1] : 1
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {dayName}
                        {isTodayDate && (
                            <motion.span
                                className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                Today
                            </motion.span>
                        )}
                    </motion.h3>

                    <motion.p
                        key={format(date, 'MMMM d, yyyy')}
                        className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5"
                        initial={{ rotateX: -90, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <Calendar size={14} />
                        <span className="date-number-flip">
                            {format(date, 'MMMM d, yyyy')}
                        </span>
                    </motion.p>
                </motion.div>

                {/* Day Progress Arc */}
                {isTodayDate && showProgress && (
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full progress-arc" viewBox="0 0 36 36">
                            {/* Background circle */}
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-muted/20"
                            />
                            {/* Progress circle */}
                            <motion.path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: dayProgress / 100 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{
                                    strokeDasharray: '100, 100',
                                    strokeDashoffset: `${100 - dayProgress}`
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                                {Math.round(dayProgress)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Current time display */}
            {showTime && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg w-fit"
                >
                    <Clock size={12} className="text-primary" />
                    <motion.span
                        key={format(now, 'HH:mm:ss')}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {format(now, 'h:mm a')}
                    </motion.span>
                </motion.div>
            )}
        </div>
    );
};
