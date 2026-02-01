import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Zap } from 'lucide-react';

interface EmptyTimeSlotProps {
    time: string;
    duration?: number;
    onAddEntry?: (time: string) => void;
    showFocusSuggestion?: boolean;
    className?: string;
}

export const EmptyTimeSlot: React.FC<EmptyTimeSlotProps> = ({
    time,
    duration = 60,
    onAddEntry,
    showFocusSuggestion = true,
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isBreakTime = duration >= 30;

    return (
        <motion.div
            className={`
                empty-slot relative rounded-lg p-4 cursor-pointer group transition-all duration-300
                ${className}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onAddEntry?.(time)}
            whileHover={{
                scale: 1.01,
                borderColor: 'hsl(var(--primary) / 0.5)'
            }}
            whileTap={{ scale: 0.99 }}
        >
            {/* Hover overlay */}
            <motion.div
                className="absolute inset-0 bg-primary/5 rounded-lg opacity-0"
                animate={{
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Time display */}
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-2 text-muted-foreground"
                        animate={{
                            x: isHovered ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <Clock size={14} />
                        <span className="text-sm font-medium">{time}</span>
                    </motion.div>

                    {/* Quick add button (reveals on hover) */}
                    <AnimatePresence>
                        {isHovered && onAddEntry && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="quick-add-reveal"
                            >
                                <motion.button
                                    className="p-2 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddEntry(time);
                                    }}
                                >
                                    <Plus size={16} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status text */}
                <AnimatePresence mode="wait">
                    {!isHovered && (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2"
                        >
                            {isBreakTime ? (
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Break time</span> · {duration}m available
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground">
                                    Available slot
                                </div>
                            )}
                        </motion.div>
                    )}

                    {isHovered && showFocusSuggestion && isBreakTime && (
                        <motion.div
                            key="suggestion"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2"
                        >
                            <motion.div
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                >
                                    <Zap size={14} className="text-secondary" />
                                </motion.div>
                                <span className="text-xs text-secondary font-medium">
                                    Perfect for a focus session!
                                </span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Animated border glow on hover */}
            <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{
                    borderColor: isHovered ? 'hsl(var(--primary) / 0.5)' : 'transparent'
                }}
                transition={{ duration: 0.2 }}
                style={{
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    opacity: isHovered ? 1 : 0
                }}
            />

            {/* Shimmer effect */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
                >
                    <motion.div
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                            x: ['-100%', '200%']
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
};
