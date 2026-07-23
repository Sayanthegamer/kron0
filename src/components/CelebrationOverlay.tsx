import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, TrendingUp, Flame, Clock } from 'lucide-react';
import { ConfettiExplosion, StarBurst } from './ConfettiExplosion';
import type { TimerMode } from '../types';

interface CelebrationOverlayProps {
    show: boolean;
    completedMinutes: number;
    sessionCount: number;
    mode: TimerMode;
    onContinue: () => void;
    onQuickRestart?: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
    show,
    completedMinutes,
    sessionCount,
    mode,
    onContinue,
    onQuickRestart
}) => {
    if (!show) return null;

    // Calculate streak info
    const streakInfo = sessionCount > 1 ? `${sessionCount} session streak!` : 'Keep it up!';
    const totalMinutes = completedMinutes;
    const encouragement = totalMinutes >= 45 ? 'Incredible focus!' : totalMinutes >= 25 ? 'Great job!' : 'Well done!';

    // Mode-specific colors
    const modeColors = {
        focus: {
            primary: '#8b2fc9',
            gradient: 'from-primary to-purple-600'
        },
        short: {
            primary: '#14b8a6',
            gradient: 'from-teal-600 to-cyan-600'
        },
        long: {
            primary: '#6366f1',
            gradient: 'from-blue-600 to-purple-600'
        },
        custom: {
            primary: '#ec4899',
            gradient: 'from-pink-600 to-rose-600'
        }
    };

    const colors = modeColors[mode];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
                >
                    <ConfettiExplosion active={show} />
                    <StarBurst active={show} />

                    <div className="relative z-10 text-center max-w-md mx-4">
                        {/* Phase 1: Trophy and main message (0-0.5s) */}
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            {/* Trophy with spin animation */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: 'easeInOut',
                                    times: [0, 0.5, 1]
                                }}
                                className="w-32 h-32 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20"
                            >
                                <Trophy className="text-primary w-16 h-16" />
                            </motion.div>

                            {/* Main celebration message */}
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-4xl md:text-5xl font-bold mb-3 text-foreground"
                            >
                                Session Complete!
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-xl md:text-2xl text-foreground mb-2 font-semibold"
                            >
                                {encouragement}
                            </motion.p>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-muted-foreground text-lg"
                            >
                                You focused for {completedMinutes} minutes
                            </motion.p>
                        </motion.div>

                        {/* Phase 2: Stats cards (0.5-1.5s) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="grid grid-cols-3 gap-4 mt-8 mb-8"
                        >
                            {/* Time stat */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-sm"
                            >
                                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                <div className="text-2xl font-bold text-foreground">{completedMinutes}</div>
                                <div className="text-xs text-muted-foreground">minutes</div>
                            </motion.div>

                            {/* Streak stat */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-4 backdrop-blur-sm"
                            >
                                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                                <div className="text-2xl font-bold text-foreground">{sessionCount}</div>
                                <div className="text-xs text-muted-foreground">sessions</div>
                            </motion.div>

                            {/* Trend stat */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm"
                            >
                                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                                <div className="text-2xl font-bold text-foreground">🔥</div>
                                <div className="text-xs text-muted-foreground">{streakInfo}</div>
                            </motion.div>
                        </motion.div>

                        {/* Phase 3: Action buttons (1.5s+) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                        >
                            {/* Quick restart button */}
                            {onQuickRestart && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onQuickRestart}
                                    className="px-5 py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-smooth font-medium text-sm"
                                >
                                    Quick Restart
                                </motion.button>
                            )}

                            {/* Continue button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onContinue}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${colors.gradient} text-white font-semibold hover:shadow-lg transition-all duration-300 shadow-lg ${mode === 'focus' ? 'shadow-violet-500/30' : mode === 'short' ? 'shadow-teal-500/30' : mode === 'long' ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'}`}
                            >
                                Continue
                                <ArrowRight size={18} />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
