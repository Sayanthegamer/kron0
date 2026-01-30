import React, { useState } from 'react';
import type { TimeTableEntry } from '../types';
import { MapPin, Clock, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ClassCardProps {
    entry: TimeTableEntry;
    status: 'past' | 'current' | 'next' | 'future';
    onClick: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ entry, status, onClick }) => {
    const [isPressed, setIsPressed] = useState(false);

    const getStatusStyles = () => {
        switch (status) {
            case 'current':
                return {
                    borderColor: 'border-primary',
                    glow: 'shadow-[0_0_20px_-5px_var(--primary)]',
                    badge: (
                        <motion.div 
                            className="px-2 py-1 rounded-full bg-primary/20 border border-primary/50 text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse-glow"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            Now
                        </motion.div>
                    ),
                    gradient: 'from-primary/10 to-purple-500/10',
                };
            case 'next':
                return {
                    borderColor: 'border-secondary',
                    glow: 'shadow-[0_0_20px_-5px_var(--secondary)]',
                    badge: (
                        <motion.div 
                            className="px-2 py-1 rounded-full bg-secondary/20 border border-secondary/50 text-[10px] font-bold text-secondary uppercase tracking-wider"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            Next
                        </motion.div>
                    ),
                    gradient: 'from-secondary/10 to-cyan-400/10',
                };
            case 'past':
                return {
                    borderColor: 'border-border opacity-60',
                    glow: '',
                    badge: (
                        <motion.div 
                            className="px-2 py-1 rounded-full bg-muted/20 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            Done
                        </motion.div>
                    ),
                    gradient: 'from-muted/5 to-transparent',
                };
            default:
                return {
                    borderColor: 'border-border',
                    glow: '',
                    badge: null,
                    gradient: 'from-transparent to-transparent',
                };
        }
    };

    const { borderColor, glow, badge, gradient } = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotate: isPressed ? -1 : 0
            }}
            whileHover={{ 
                scale: status === 'past' ? 1 : 1.02,
                y: status === 'past' ? 0 : -2,
                transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            whileTap={{ 
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
            onClick={() => {
                setIsPressed(true);
                setTimeout(() => setIsPressed(false), 150);
                onClick();
            }}
            className={twMerge(
                "relative overflow-hidden rounded-xl p-5 border backdrop-blur-md transition-all duration-300 cursor-pointer group",
                "glass-card hover:bg-black/5 dark:hover:bg-white/10 hover-lift focus-ring",
                borderColor,
                glow,
                status === 'past' && 'grayscale-[0.5] opacity-75'
            )}
            style={{ willChange: 'transform' }}
        >
            {/* Animated Background Gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                initial={false}
                animate={{ opacity: isPressed ? 0.3 : 0 }}
                transition={{ duration: 0.2 }}
            />

            {/* Enhanced Sidebar Color Strip */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full"
                style={{ backgroundColor: entry.color || 'var(--primary)' }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ 
                    duration: 0.6, 
                    ease: "easeOut",
                    delay: 0.1
                }}
            />

            {/* Shimmer Effect on Hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ 
                    x: '100%',
                    transition: { duration: 0.6, ease: "easeInOut" }
                }}
            />

            <div className="flex justify-between items-start pl-3 gap-2 relative z-10">
                <div className="flex-1 min-w-0">
                    <motion.h3 
                        className={`text-lg font-bold tracking-tight mb-1.5 break-words transition-colors duration-200 ${status === 'past' ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {entry.subject}
                    </motion.h3>

                    <motion.div 
                        className="flex items-center gap-4 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div 
                            className="flex items-center gap-1.5"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Clock 
                                size={14} 
                                className={`transition-colors duration-200 ${status === 'current' ? 'text-primary' : 'group-hover:text-primary'}`} 
                            />
                            <span className={`transition-colors duration-200 ${status === 'current' ? 'text-primary font-semibold' : 'group-hover:text-primary'}`}>
                                {entry.startTime} - {entry.endTime}
                            </span>
                        </motion.div>
                        {entry.location && (
                            <motion.div 
                                className="flex items-center gap-1.5"
                                whileHover={{ scale: 1.05 }}
                            >
                                <MapPin size={14} className="group-hover:text-primary transition-colors duration-200" />
                                <span className="group-hover:text-primary transition-colors duration-200">{entry.location}</span>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Status Badge */}
                {badge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 15,
                            delay: 0.4
                        }}
                    >
                        {badge}
                    </motion.div>
                )}

                {/* Enhanced Edit Indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 bg-black/20 dark:bg-white/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                    whileHover={{ 
                        backgroundColor: 'rgba(139, 47, 201, 0.2)',
                        transition: { duration: 0.2 }
                    }}
                >
                    <Pencil size={14} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </motion.div>
            </div>

            {/* Interactive Ripple Effect */}
            <motion.div
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{ pointerEvents: 'none' }}
            >
                {isPressed && (
                    <motion.div
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </motion.div>

            {/* Status-specific glow pulse */}
            {status === 'current' && (
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        boxShadow: 'inset 0 0 0 2px var(--primary), 0 0 20px var(--primary)',
                    }}
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}
        </motion.div>
    );
};
