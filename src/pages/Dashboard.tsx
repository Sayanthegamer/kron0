import React, { useState } from 'react';

import { useScheduleStatus } from '../hooks/useScheduleStatus';
import { ClassCard } from '../components/ClassCard';
import { TodoWidget } from '../components/TodoWidget';
import type { TimeTableEntry, DayOfWeek } from '../types';
import { format, isWithinInterval, parse, getDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Plus, ChevronDown, Zap } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTimetable } from '../context/TimetableContext';

interface DashboardProps {
    onEntryClick: (entry: TimeTableEntry) => void;
    onAddEntry: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEntryClick, onAddEntry }) => {
    const { user } = useAuth();
    const { entries } = useTimetable();
    const { currentClass, nextClass, now } = useScheduleStatus();
    const [showPastClasses, setShowPastClasses] = useState(false);
    const [isHeaderLoaded, setIsHeaderLoaded] = useState(false);

    // Dynamic Greeting
    const hour = now.getHours();
    let timeGreeting = 'Good Morning';
    if (hour >= 12) timeGreeting = 'Good Afternoon';
    if (hour >= 18) timeGreeting = 'Good Evening';

    const displayName = user?.displayName ? user.displayName.split(' ')[0] : 'Friend';

    // Get all today's classes sorted by time
    const todayEntries = React.useMemo(() => {
        const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayName = days[getDay(now)] as DayOfWeek;
        return entries
            .filter(e => e.days.includes(currentDayName))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [entries, now]);

    // Categorize classes
    const pastClasses = todayEntries.filter(entry => {
        const end = parse(entry.endTime, 'HH:mm', now);
        return end < now;
    });

    const upcomingClasses = todayEntries.filter(entry => {
        const start = parse(entry.startTime, 'HH:mm', now);
        const end = parse(entry.endTime, 'HH:mm', now);
        return start >= now || isWithinInterval(now, { start, end });
    });

    React.useEffect(() => {
        const timer = setTimeout(() => setIsHeaderLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Enhanced Header Widget */}
            <header className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ 
                        opacity: isHeaderLoaded ? 1 : 0, 
                        y: isHeaderLoaded ? 0 : -20, 
                        scale: isHeaderLoaded ? 1 : 0.95 
                    }}
                    transition={{ 
                        duration: 0.6, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                    }}
                >
                    <motion.div 
                        className="flex items-center gap-2 mb-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="text-secondary w-5 h-5" />
                        </motion.div>
                        <motion.span 
                            className="text-sm font-medium text-secondary uppercase tracking-widest"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {timeGreeting}
                        </motion.span>
                    </motion.div>
                    
                    <motion.h2 
                        className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-entrance"
                        initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
                        animate={{ backgroundPosition: '100% 50%' }}
                        transition={{ 
                            duration: 1.5,
                            delay: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                    >
                        Hi, {displayName}
                    </motion.h2>
                    
                    <motion.p 
                        className="text-muted-foreground text-lg mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {format(now, 'EEEE, MMMM d, yyyy')}
                    </motion.p>
                </motion.div>
            </header>

            {/* Enhanced UP NEXT WIDGET */}
            <section>
                <AnimatePresence mode="wait">
                    {currentClass ? (
                        <motion.div
                            key="current"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9 }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 120,
                                damping: 15
                            }}
                            className="animate-entrance"
                        >
                            <motion.div 
                                className="flex items-center justify-between mb-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    <Zap className="text-primary w-5 h-5" />
                                    Happening Now
                                </h3>
                                <motion.span 
                                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-pulse-glow border border-primary/30"
                                    animate={{ 
                                        boxShadow: [
                                            '0 0 0 0 rgba(139, 47, 201, 0.4)',
                                            '0 0 0 10px rgba(139, 47, 201, 0)',
                                        ]
                                    }}
                                    transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                >
                                    Live
                                </motion.span>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                            >
                                <ClassCard
                                    entry={currentClass}
                                    status="current"
                                    onClick={() => onEntryClick(currentClass)}
                                />
                            </motion.div>
                        </motion.div>
                    ) : nextClass ? (
                        <motion.div
                            key="next"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9 }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 120,
                                damping: 15
                            }}
                            className="animate-entrance"
                        >
                            <motion.div 
                                className="flex items-center justify-between mb-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="text-secondary w-5 h-5" />
                                    Up Next
                                </h3>
                                <motion.span 
                                    className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    in {format(parse(nextClass.startTime, 'HH:mm', now), 'h:mm a')}
                                </motion.span>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                            >
                                <ClassCard
                                    entry={nextClass}
                                    status="next"
                                    onClick={() => onEntryClick(nextClass)}
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 120,
                                damping: 15
                            }}
                            className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center py-12 border-dashed border-border animate-entrance"
                        >
                            <motion.div 
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                animate={{ 
                                    y: [0, -5, 0],
                                }}
                                transition={{ 
                                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { type: "spring", stiffness: 300 }
                                }}
                            >
                                <Clock className="text-green-400 w-8 h-8" />
                            </motion.div>
                            <motion.h3 
                                className="text-xl font-bold text-foreground mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                All caught up!
                            </motion.h3>
                            <motion.p 
                                className="text-muted-foreground"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                No more classes for today. Enjoy your free time!
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Enhanced TODAY'S SCHEDULE */}
            {todayEntries.length > 0 && (
                <section>
                    <motion.div 
                        className="flex items-center justify-between mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                            Today's Schedule
                            <motion.span 
                                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                            >
                                {todayEntries.length} {todayEntries.length === 1 ? 'class' : 'classes'}
                            </motion.span>
                        </h3>
                        <motion.button
                            onClick={onAddEntry}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth focus-ring group hover-lift"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 90 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Plus size={16} />
                            </motion.div>
                            <span>Add Class</span>
                        </motion.button>
                    </motion.div>

                    <div className="space-y-3">
                        {/* Upcoming Classes */}
                        {upcomingClasses.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ 
                                    delay: index * 0.08, 
                                    duration: 0.4,
                                    ease: "easeOut",
                                    type: "spring",
                                    stiffness: 100
                                }}
                                className="stagger-animation"
                            >
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <ClassCard
                                        entry={entry}
                                        status={entry === currentClass ? 'current' : entry === nextClass ? 'next' : 'future'}
                                        onClick={() => onEntryClick(entry)}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Past Classes Section */}
                        {pastClasses.length > 0 && (
                            <>
                                <motion.div 
                                    className="py-2 flex items-center gap-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: upcomingClasses.length * 0.08 + 0.2 }}
                                >
                                    <motion.div 
                                        className="flex-1 h-px bg-border"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, delay: upcomingClasses.length * 0.08 + 0.3 }}
                                    />
                                    <motion.button
                                        onClick={() => setShowPastClasses(!showPastClasses)}
                                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="uppercase tracking-wider">Past</span>
                                        <motion.div
                                            animate={{ rotate: showPastClasses ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size={14} />
                                        </motion.div>
                                    </motion.button>
                                    <motion.div 
                                        className="flex-1 h-px bg-border"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, delay: upcomingClasses.length * 0.08 + 0.3 }}
                                    />
                                </motion.div>

                                <AnimatePresence>
                                    {showPastClasses && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            {pastClasses.map((entry, index) => (
                                                <motion.div
                                                    key={entry.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ 
                                                        delay: index * 0.05, 
                                                        duration: 0.3,
                                                        ease: "easeOut"
                                                    }}
                                                >
                                                    <ClassCard
                                                        entry={entry}
                                                        status="past"
                                                        onClick={() => onEntryClick(entry)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* PRODUCTIVITY WIDGETS */}
            <section id="todo-widget">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        delay: 0.5,
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    className="animate-entrance"
                >
                    <TodoWidget />
                </motion.div>
            </section>
        </div>
    );
};
