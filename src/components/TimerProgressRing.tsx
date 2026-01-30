import React from 'react';
import { motion } from 'framer-motion';
import type { TimerMode } from '../types';

interface TimerProgressRingProps {
    progress: number;
    mode: TimerMode;
    isActive: boolean;
}

export const TimerProgressRing: React.FC<TimerProgressRingProps> = ({
    progress,
    mode,
    isActive
}) => {
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const modeColors = {
        focus: {
            primary: '#8b2fc9',
            secondary: '#ec4899',
            glow: 'rgba(139, 47, 201, 0.4)',
            shadow: 'rgba(139, 47, 201, 0.6)'
        },
        short: {
            primary: '#14b8a6',
            secondary: '#22d3ee',
            glow: 'rgba(20, 184, 166, 0.4)',
            shadow: 'rgba(20, 184, 166, 0.6)'
        },
        long: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            glow: 'rgba(99, 102, 241, 0.4)',
            shadow: 'rgba(99, 102, 241, 0.6)'
        },
        custom: {
            primary: '#ec4899',
            secondary: '#f472b6',
            glow: 'rgba(236, 72, 153, 0.4)',
            shadow: 'rgba(236, 72, 153, 0.6)'
        }
    };

    const colors = modeColors[mode];

    return (
        <div className="relative scale-90 md:scale-100 transition-transform">
            {/* Background Glow */}
            {isActive && (
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="absolute inset-0 rounded-full blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`
                    }}
                />
            )}

            {/* SVG Ring */}
            <svg
                width="280"
                height="280"
                viewBox="0 0 280 280"
                className="transform -rotate-90 relative z-10"
            >
                <defs>
                    {/* Gradient for progress ring */}
                    <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id={`glow-${mode}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Inner ring glow */}
                    <filter id="inner-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Ring (breathing) */}
                <motion.circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="transparent"
                    className="text-white/5"
                    animate={{
                        scale: isActive ? [1, 1.02, 1] : 1,
                        opacity: isActive ? [0.3, 0.5, 0.3] : 0.3
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Inner Decorative Ring */}
                <circle
                    cx="140"
                    cy="140"
                    r={radius - 20}
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="transparent"
                    className="text-white/10"
                    opacity="0.5"
                />

                {/* Inner Decorative Ring 2 */}
                <circle
                    cx="140"
                    cy="140"
                    r={radius + 20}
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="transparent"
                    className="text-white/5"
                    opacity="0.3"
                />

                {/* Progress Ring */}
                <motion.circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke={`url(#gradient-${mode})`}
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'linear' }}
                    strokeLinecap="round"
                    filter={`url(#glow-${mode})`}
                    style={{
                        boxShadow: `0 0 20px ${colors.shadow}`
                    }}
                />

                {/* Animated particles on the ring */}
                {isActive && progress > 0 && (
                    <motion.circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill={colors.primary}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [1, 0.5, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut'
                        }}
                        style={{
                            transformOrigin: `140px ${140 - radius}px`,
                            transform: `rotate(${(progress / 100) * 360}deg)`
                        }}
                    />
                )}

                {/* Second particle */}
                {isActive && progress > 0 && (
                    <motion.circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill={colors.secondary}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [1, 0.3, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 0.75
                        }}
                        style={{
                            transformOrigin: `140px ${140 - radius}px`,
                            transform: `rotate(${((progress / 100) * 360 + 180) % 360}deg)`
                        }}
                    />
                )}
            </svg>

            {/* Floating particles around the timer */}
            {isActive && (
                <>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                background: colors.primary,
                                boxShadow: `0 0 10px ${colors.primary}`
                            }}
                            animate={{
                                x: [0, Math.cos((i * 60) * Math.PI / 180) * 140],
                                y: [0, Math.sin((i * 60) * Math.PI / 180) * 140],
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: 'easeOut'
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};
