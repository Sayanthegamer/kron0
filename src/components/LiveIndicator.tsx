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
            {/* LIVE NOW Badge — CSS pulse glow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-primary live-badge-pulse">
                {/* Spinning radio icon — CSS spin */}
                <div className="animate-spin-slow">
                    <Radio size={16} />
                </div>

                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    {/* Blinking dot — CSS pulse */}
                    <span className="animate-pulse-glow">●</span>
                    Live Now
                </span>

                {/* Time remaining — CSS micro-pulse */}
                <div className="ml-2 px-2 py-0.5 rounded bg-primary/30 text-xs font-bold micro-pulse">
                    {remainingMinutes}m left
                </div>
            </div>

            {/* Animated progress bar */}
            <div className="mt-3">
                <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Shimmer on progress bar — CSS */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent gradient-shimmer" />
                    </motion.div>
                </div>

                {/* Progress percentage — subtle CSS breathe */}
                <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between breathing-animation">
                    <span>
                        {formatTime(elapsedMinutes)} / {formatTime(totalMinutes)}
                    </span>
                    <span className="text-primary font-semibold">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Pulsing border glow — CSS ambient */}
            <div
                className="absolute -inset-2 rounded-2xl -z-10 ambient-glow"
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
