import React from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { parse, differenceInMinutes } from 'date-fns';
import type { TimeTableEntry } from '../types';

interface LiveIndicatorProps {
    entry: TimeTableEntry;
    currentTime: Date;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ entry, currentTime }) => {
    const start = parse(entry.startTime, 'HH:mm', currentTime);
    const end = parse(entry.endTime, 'HH:mm', currentTime);
    const totalMinutes = differenceInMinutes(end, start);
    const elapsedMinutes = differenceInMinutes(currentTime, start);
    const progress = Math.max(0, Math.min(100, (elapsedMinutes / totalMinutes) * 100));
    const remainingMinutes = Math.max(0, Math.floor((end.getTime() - currentTime.getTime()) / 60000));

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="relative"
        >
            {/* LIVE NOW Badge with Pulsing Glow */}
            <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-primary live-now-indicator"
                animate={{
                    scale: [1, 1.02, 1],
                    boxShadow: [
                        '0 0 20px -5px rgba(139, 47, 201, 0.4)',
                        '0 0 30px -5px rgba(139, 47, 201, 0.6)',
                        '0 0 20px -5px rgba(139, 47, 201, 0.4)'
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Animated radio waves */}
                <motion.div
                    className="relative"
                    animate={{
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Radio size={16} />
                </motion.div>

                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <motion.span
                        animate={{
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        ●
                    </motion.span>
                    Live Now
                </span>

                {/* Time remaining */}
                <motion.div
                    className="ml-2 px-2 py-0.5 rounded bg-primary/30 text-xs font-bold"
                    animate={{
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity
                    }}
                >
                    {remainingMinutes}m left
                </motion.div>
            </motion.div>

            {/* Animated progress ring */}
            <div className="mt-3">
                <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Animated shimmer on progress bar */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                </div>

                {/* Progress percentage */}
                <motion.div
                    className="text-xs text-muted-foreground mt-1 flex items-center justify-between"
                    animate={{
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <span>
                        {formatTime(elapsedMinutes)} / {formatTime(totalMinutes)}
                    </span>
                    <span className="text-primary font-semibold">
                        {Math.round(progress)}%
                    </span>
                </motion.div>
            </div>

            {/* Pulsing border glow effect */}
            <motion.div
                className="absolute -inset-2 rounded-2xl -z-10"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2))',
                    filter: 'blur(10px)'
                }}
            />
        </motion.div>
    );
};

// Helper function to format minutes as HH:MM
const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};
