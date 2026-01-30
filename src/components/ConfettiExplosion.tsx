import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiExplosionProps {
    active: boolean;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
    active
}) => {
    interface ConfettiPiece {
        id: number;
        color: string;
        x: number;
        y: number;
        rotate: number;
        scale: number;
        delay: number;
        isCircle: boolean;
    }

    const [confettiPieces, setConfettiPieces] = React.useState<ConfettiPiece[]>([]);

    React.useEffect(() => {
        const colors = [
            '#ffd700', // gold
            '#ff6b6b', // red
            '#4ecdc4', // teal
            '#a855f7', // purple
            '#22d3ee', // cyan
            '#f472b6', // pink
            '#8b5cf6', // violet
            '#14b8a6'  // emerald
        ];

        setConfettiPieces(Array.from({ length: 50 }, (_, i) => ({
            id: i,
            color: colors[i % colors.length],
            x: Math.random() * 400 - 200,
            y: Math.random() * -400 - 100,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5,
            delay: Math.random() * 0.3,
            isCircle: Math.random() > 0.5
        })));
    }, []);

    if (!active) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute w-2 h-2"
                    style={{
                        background: piece.color,
                        left: '50%',
                        top: '50%',
                        borderRadius: piece.isCircle ? '50%' : '2px',
                        boxShadow: `0 0 10px ${piece.color}`
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 0,
                        opacity: 1
                    }}
                    animate={{
                        x: piece.x,
                        y: piece.y,
                        rotate: piece.rotate,
                        scale: piece.scale,
                        opacity: 0
                    }}
                    transition={{
                        duration: 2,
                        delay: piece.delay,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                />
            ))}
        </div>
    );
};

interface StarBurstProps {
    active: boolean;
}

export const StarBurst: React.FC<StarBurstProps> = ({ active }) => {
    interface Star {
        id: number;
        angle: number;
        distance: number;
        delay: number;
    }

    const [stars, setStars] = React.useState<Star[]>([]);

    React.useEffect(() => {
        setStars(Array.from({ length: 20 }, (_, i) => ({
            id: i,
            angle: (i / 20) * 360,
            distance: 150 + Math.random() * 100,
            delay: Math.random() * 0.2
        })));
    }, []);

    if (!active) return null;

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute text-2xl"
                    style={{
                        color: '#ffd700',
                        left: '50%',
                        top: '50%',
                        marginLeft: -12,
                        marginTop: -12
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        opacity: 1
                    }}
                    animate={{
                        x: Math.cos(star.angle * Math.PI / 180) * star.distance,
                        y: Math.sin(star.angle * Math.PI / 180) * star.distance,
                        scale: [0, 1.5, 0],
                        opacity: [1, 1, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: 1.5,
                        delay: star.delay,
                        ease: 'easeOut'
                    }}
                >
                    ✨
                </motion.div>
            ))}
        </div>
    );
};
