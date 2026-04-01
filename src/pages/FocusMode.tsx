import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Coffee, Wind, Settings2 } from 'lucide-react';
import { useFocus } from '../hooks/useFocus';
import { MODES } from '../constants';
import { type TimerMode } from '../types';
import { TimerProgressRing } from '../components/TimerProgressRing';
import { FloatingParticles } from '../components/FloatingParticles';
import { StatusIndicator } from '../components/StatusIndicator';
import { CelebrationOverlay } from '../components/CelebrationOverlay';

export const FocusMode: React.FC = () => {
    const {
        mode,
        setMode,
        timeLeft,
        isActive,
        toggleTimer,
        resetTimer,
        setCustomDuration,
        customMinutes,
        sessionHistory,
        lastCompletedSession
    } = useFocus();

    const [showCelebration, setShowCelebration] = useState(false);
    const [prevSeconds, setPrevSeconds] = useState(timeLeft);

    // Track second changes for animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setPrevSeconds(timeLeft);
        }, 100);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    // Show celebration when timer completes
    useEffect(() => {
        if (lastCompletedSession && !showCelebration && (Date.now() - lastCompletedSession.startTime) < 5000) {
            const timer = setTimeout(() => setShowCelebration(true), 0);
            return () => clearTimeout(timer);
        }
    }, [lastCompletedSession, showCelebration]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return { mins, secs };
    };

    // Circular Progress Calculation
    const currentTotalTime = (mode === 'custom')
        ? (customMinutes * 60)
        : MODES[mode].minutes * 60;

    const progress = Math.max(0, Math.min(100, ((currentTotalTime - timeLeft) / currentTotalTime) * 100));

    const handleModeSwitch = (newMode: TimerMode) => {
        const hasProgress = timeLeft < currentTotalTime && timeLeft > 0;

        if (isActive || hasProgress) {
            const confirmSwitch = window.confirm("Timer is in progress! Switching modes will reset the current timer. Continue?");
            if (!confirmSwitch) return;
        }
        setMode(newMode);
    };

    const handleQuickStart = (minutes: number) => {
        setCustomDuration(minutes);
        if (mode !== 'custom') {
            setMode('custom');
        }
    };

    // Mode-specific colors and styles
    const modeConfig = {
        focus: {
            icon: <Target size={16} />,
            bgGradient: 'from-violet-600/20 to-purple-600/10',
            borderGlow: 'glow-focus',
            textGlow: 'text-primary'
        },
        short: {
            icon: <Coffee size={16} />,
            bgGradient: 'from-teal-600/20 to-cyan-600/10',
            borderGlow: 'glow-break',
            textGlow: 'text-teal-500'
        },
        long: {
            icon: <Wind size={16} />,
            bgGradient: 'from-indigo-600/20 to-violet-600/10',
            borderGlow: 'glow-long-break',
            textGlow: 'text-indigo-500'
        },
        custom: {
            icon: <Settings2 size={16} />,
            bgGradient: 'from-pink-600/20 to-rose-600/10',
            borderGlow: 'glow-custom',
            textGlow: 'text-pink-500'
        }
    };

    const config = modeConfig[mode];
    const { mins, secs } = formatTime(timeLeft);
    const secondsChanged = secs !== (formatTime(prevSeconds).secs);

    return (
        <div className={`flex flex-col items-center justify-center p-6 space-y-8 h-full min-h-[70vh] relative overflow-hidden transition-all duration-500 bg-gradient-to-b ${config.bgGradient}`}>

            {/* Floating Particles Background */}
            <FloatingParticles isActive={isActive} modeColor={mode === 'focus' ? '#8b2fc9' : mode === 'short' ? '#14b8a6' : mode === 'long' ? '#6366f1' : '#ec4899'} />

            {/* Celebration Overlay */}
            <CelebrationOverlay
                show={showCelebration}
                completedMinutes={lastCompletedSession?.duration || 0}
                sessionCount={sessionHistory.length}
                mode={mode}
                onContinue={() => setShowCelebration(false)}
                onQuickRestart={() => {
                    setShowCelebration(false);
                    resetTimer();
                    toggleTimer();
                }}
            />

            {/* Session Counter - Enhanced */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-md shadow-lg transition-all ${isActive ? config.borderGlow : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5'}`}
            >
                <motion.div
                    animate={showCelebration ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                >
                    <svg className="text-white w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </motion.div>
                <div className="flex flex-col">
                    <span className="font-bold text-foreground text-lg">{sessionHistory.length}</span>
                    <span className="text-xs text-muted-foreground">sessions</span>
                </div>
            </motion.div>

            {/* Mode Selector - Redesigned */}
            <div className="relative flex p-1.5 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/5 w-full max-w-sm mx-auto">
                {(Object.keys(MODES) as TimerMode[]).map((m) => {
                    const isActiveMode = mode === m;
                    const modeData = modeConfig[m];
                    return (
                        <button
                            key={m}
                            onClick={() => handleModeSwitch(m)}
                            className={`relative flex-1 py-3 text-sm font-semibold transition-all z-10 ${isActiveMode ? 'text-white' : 'text-muted-foreground hover:text-white/80'
                                }`}
                        >
                            {isActiveMode && (
                                <motion.div
                                    layoutId="active-mode-pill"
                                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5, ease: 'easeOut' }}
                                />
                            )}
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {modeData.icon}
                                <span className="hidden sm:inline whitespace-nowrap">{MODES[m].label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Custom Input - Enhanced */}
            <AnimatePresence>
                {mode === 'custom' && !isActive && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="flex items-center gap-3 bg-black/5 dark:bg-white/5 px-6 py-3 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm"
                    >
                        <Settings2 size={18} className="text-muted-foreground" />
                        <input
                            type="number"
                            min="1"
                            max="180"
                            placeholder="Mins"
                            className="bg-transparent text-foreground border-none focus:outline-none focus:ring-0 w-20 text-center font-bold text-lg"
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) setCustomDuration(val);
                            }}
                        />
                        <span className="text-sm text-muted-foreground font-medium">minutes</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timer Display - Premium Multi-Ring */}
            <div className="relative flex items-center justify-center">
                <TimerProgressRing
                    progress={progress}
                    mode={mode}
                    isActive={isActive}
                />

                {/* Time Text - Enhanced */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Minutes */}
                    <motion.div
                        key={`mins-${mins}`}
                        initial={secondsChanged ? { scale: 0.8, opacity: 0.5, rotateX: -90 } : false}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`text-6xl md:text-8xl font-bold font-mono tracking-tighter ${config.textGlow} timer-text-glow`}
                    >
                        {mins.toString().padStart(2, '0')}
                    </motion.div>

                    {/* Separator */}
                    <motion.div
                        animate={isActive ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                        transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                        className={`text-4xl md:text-6xl font-bold font-mono ${config.textGlow} -my-2 md:-my-4`}
                    >
                        :
                    </motion.div>

                    {/* Seconds */}
                    <motion.div
                        key={`secs-${secs}`}
                        initial={{ scale: 0.8, opacity: 0.5, rotateX: -90 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`text-6xl md:text-8xl font-bold font-mono tracking-tighter ${config.textGlow} timer-text-glow`}
                    >
                        {secs.toString().padStart(2, '0')}
                    </motion.div>
                </div>

            </div>

            {/* Status Indicator - Moved below timer */}
            <div className="relative z-10">
                <StatusIndicator
                    isActive={isActive}
                    mode={mode}
                />
            </div>

            {/* Controls - Enhanced Button Group */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Quick Start Buttons - Only visible when paused */}
                <AnimatePresence>
                    {!isActive && timeLeft > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="hidden sm:flex flex-col gap-2"
                        >
                            <button
                                onClick={() => handleQuickStart(5)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth"
                            >
                                5m
                            </button>
                            <button
                                onClick={() => handleQuickStart(15)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth"
                            >
                                15m
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reset Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: -180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-smooth shadow-lg"
                >
                    <RotateCcw size={24} />
                </motion.button>

                {/* Play/Pause Button - Enhanced */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`relative p-8 md:p-9 rounded-2xl shadow-2xl transform transition-all overflow-hidden group ${isActive
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-amber-500/40'
                        : 'bg-gradient-to-br from-primary to-purple-600 text-white hover:shadow-primary/40'
                        }`}
                    style={{
                        boxShadow: isActive
                            ? '0 20px 60px -15px rgba(251, 146, 60, 0.6)'
                            : '0 20px 60px -15px rgba(139, 47, 201, 0.6)',
                    }}
                >
                    {/* Gradient shimmer — CSS */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent gradient-shimmer" />

                    {/* Ripple effect on click */}
                    <motion.div
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* Icon with morph animation */}
                    <motion.div
                        key={isActive ? 'pause' : 'play'}
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {isActive ? (
                            <Pause size={36} fill="currentColor" />
                        ) : (
                            <Play size={36} fill="currentColor" className="ml-1" />
                        )}
                    </motion.div>
                </motion.button>

                {/* Quick Start Buttons - Only visible when paused (mobile) */}
                <AnimatePresence>
                    {!isActive && timeLeft > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex sm:hidden flex-col gap-2"
                        >
                            <button
                                onClick={() => handleQuickStart(5)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth"
                            >
                                5m
                            </button>
                            <button
                                onClick={() => handleQuickStart(15)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth"
                            >
                                15m
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
