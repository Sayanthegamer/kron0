import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
    isActive: boolean;
    modeColor: string;
}

interface Particle {
    id: number;
    size: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    delay: number;
    duration: number;
    opacity: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    isActive,
    modeColor
}) => {
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            startX: Math.random() * 100,
            startY: Math.random() * 100,
            endX: Math.random() * 100,
            endY: Math.random() * 100 - 50,
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 2,
            opacity: Math.random() * 0.5 + 0.2
        }))
    );

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        background: modeColor,
                        opacity: particle.opacity,
                        boxShadow: `0 0 ${particle.size * 2}px ${modeColor}`
                    }}
                    initial={{
                        left: `${particle.startX}%`,
                        top: `${particle.startY}%`,
                        scale: 0
                    }}
                    animate={{
                        left: `${particle.endX}%`,
                        top: `${particle.endY}%`,
                        scale: [0, 1, 0],
                        opacity: [0, particle.opacity, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
};
