import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimerMode } from '../types';

interface StatusIndicatorProps {
    isActive: boolean;
    mode: TimerMode;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    isActive,
    mode
}) => {
    const statusMessages = {
        focus: {
            active: 'In the zone...',
            paused: 'Ready when you are'
        },
        short: {
            active: 'Recharging...',
            paused: 'Take a breather'
        },
        long: {
            active: 'Deep rest...',
            paused: 'Time to unwind'
        },
        custom: {
            active: 'On your terms...',
            paused: 'Set your pace'
        }
    };

    const modeColors = {
        focus: 'bg-primary',
        short: 'bg-teal-500',
        long: 'bg-indigo-500',
        custom: 'bg-pink-500'
    };

    const modeGlow = {
        focus: 'shadow-primary/50',
        short: 'shadow-teal-500/50',
        long: 'shadow-indigo-500/50',
        custom: 'shadow-pink-500/50'
    };

    const message = isActive ? statusMessages[mode].active : statusMessages[mode].paused;

    return (
        <div className="flex flex-col items-center gap-2 mt-4">
            {/* Animated status badge */}
            <motion.div
                animate={{
                    scale: isActive ? [1, 1.05, 1] : 1,
                    boxShadow: isActive ? `0 0 20px var(--${mode === 'focus' ? 'primary' : mode === 'short' ? 'teal' : mode === 'long' ? 'indigo' : 'pink'}-500)` : 'none'
                }}
                transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    ease: 'easeInOut'
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${modeColors[mode]} text-white font-medium text-sm shadow-lg ${modeGlow[mode]}`}
            >
                {/* Animated dots when active */}
                <AnimatePresence mode="wait">
                    {isActive && (
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
                <span>{message}</span>
            </motion.div>

            {/* Subtle helper text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs text-muted-foreground ${isActive ? '' : 'opacity-60'}`}
            >
                {isActive ? 'Stay focused' : 'Press play to begin'}
            </motion.p>
        </div>
    );
};
