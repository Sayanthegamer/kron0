import React, { useState } from 'react';

import { useScheduleStatus } from '../hooks/useScheduleStatus';
import { ClassCard } from '../components/ClassCard';
import { TodoWidget } from '../components/TodoWidget';
import { LiveBadge } from '../components/LiveBadge';
import { QuickAddButton } from '../components/QuickAddButton';
import { SectionDivider } from '../components/SectionDivider';
import { StaggeredList } from '../components/StaggeredList';
import { ClassCardSkeleton } from '../components/SkeletonLoader';
import { EmptyStateEnhanced } from '../components/EmptyStateEnhanced';
import type { TimeTableEntry, DayOfWeek } from '../types';
import { format, isWithinInterval, parse, getDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, ChevronDown, Zap, Calendar } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useTimetable } from '../hooks/useTimetable';

interface DashboardProps {
    onEntryClick: (entry: TimeTableEntry) => void;
    onAddEntry: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEntryClick, onAddEntry }) => {
    const { user } = useAuth();
    const { entries, isLoading } = useTimetable();
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
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Zap className="text-primary w-5 h-5" />
                                    </motion.div>
                                    Happening Now
                                </h3>
                                <LiveBadge variant="live" />
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
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                        <motion.div
                                            animate={{ 
                                                rotate: [0, 360],
                                            }}
                                            transition={{ 
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        >
                                            <Clock className="text-secondary w-5 h-5" />
                                        </motion.div>
                                        Up Next
                                    </h3>
                                    <motion.span 
                                        className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        in {format(parse(nextClass.startTime, 'HH:mm', now), 'h:mm a')}
                                    </motion.span>
                                </div>
                                <LiveBadge variant="next" />
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
            {(todayEntries.length > 0 || isLoading) && (
                <section>
                    <motion.div 
                        className="flex items-center justify-between mb-6"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{ 
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Calendar className="text-primary w-5 h-5" />
                            </motion.div>
                            <h3 className="text-xl font-semibold text-foreground">
                                Today's Schedule
                            </h3>
                            {!isLoading && (
                                <motion.div
                                    className="flex items-center gap-2 text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/30"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                                >
                                    <motion.span 
                                        className="text-lg font-bold"
                                        key={todayEntries.length}
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                    >
                                        {todayEntries.length}
                                    </motion.span>
                                    <span className="uppercase tracking-wider font-semibold">
                                        {todayEntries.length === 1 ? 'class' : 'classes'}
                                    </span>
                                </motion.div>
                            )}
                        </div>
                        <QuickAddButton onClick={onAddEntry} expanded />
                    </motion.div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <ClassCardSkeleton />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Upcoming Classes with staggered animation */}
                            <StaggeredList staggerDelay={0.08} direction="left">
                                {upcomingClasses.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <ClassCard
                                            entry={entry}
                                            status={entry === currentClass ? 'current' : entry === nextClass ? 'next' : 'future'}
                                            onClick={() => onEntryClick(entry)}
                                            index={index}
                                        />
                                    </motion.div>
                                ))}
                            </StaggeredList>

                            {/* Past Classes Section */}
                            {pastClasses.length > 0 && (
                                <>
                                    <SectionDivider
                                        label="Past Classes"
                                        icon={<ChevronDown size={14} />}
                                        count={pastClasses.length}
                                        onToggle={() => setShowPastClasses(!showPastClasses)}
                                        isExpanded={showPastClasses}
                                        animated={true}
                                    />

                                    <AnimatePresence>
                                        {showPastClasses && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden space-y-3"
                                            >
                                                <StaggeredList staggerDelay={0.05} direction="left">
                                                    {pastClasses.map((entry, index) => (
                                                        <ClassCard
                                                            key={entry.id}
                                                            entry={entry}
                                                            status="past"
                                                            onClick={() => onEntryClick(entry)}
                                                            index={index}
                                                        />
                                                    ))}
                                                </StaggeredList>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Empty state when no classes today */}
            {!isLoading && todayEntries.length === 0 && !currentClass && !nextClass && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <EmptyStateEnhanced
                        title="No classes today!"
                        description="Looks like you have a free day. Why not add some study time or plan for the week ahead?"
                        icon="coffee"
                        actionLabel="Add Class"
                        onAction={onAddEntry}
                    />
                </motion.section>
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
