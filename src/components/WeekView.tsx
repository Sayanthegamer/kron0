import React from 'react';
import { useTimetable } from '../context/TimetableContext';
import type { TimeTableEntry, DayOfWeek } from '../types';
import { ClassCard } from './ClassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface WeekViewProps {
    onEntryClick: (entry: TimeTableEntry) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeekView: React.FC<WeekViewProps> = ({ onEntryClick }) => {
    const { entries } = useTimetable();
    const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>('Monday');
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    // Get current day on mount to auto-select
    React.useEffect(() => {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
        if (DAYS.includes(today)) {
            setSelectedDay(today);
        }
    }, []);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    React.useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const dayEntries = entries
        .filter(e => e.days.includes(selectedDay))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Horizontal Day Selector */}
            <div className="relative group">
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x px-1"
                >
                    {DAYS.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`
                                whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-semibold transition-all snap-center
                                ${selectedDay === day
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                            `}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Left Scroll Hint */}
                <AnimatePresence>
                    {canScrollLeft && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none flex items-center justify-start pl-1"
                        >
                            <motion.div
                                animate={{ x: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-primary"
                            >
                                <ChevronLeft size={20} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Scroll Hint */}
                <AnimatePresence>
                    {canScrollRight && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none flex items-center justify-end pr-1"
                        >
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-primary"
                            >
                                <ChevronRight size={20} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-[300px]">
                <h3 className="text-2xl font-bold mb-4 px-1">{selectedDay}</h3>

                <div className="space-y-3 pb-24">
                    {dayEntries.length > 0 ? (
                        dayEntries.map(entry => (
                            <motion.div
                                key={`${entry.id}-${selectedDay}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ClassCard
                                    entry={entry}
                                    status="future"
                                    onClick={() => onEntryClick(entry)}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-muted-foreground bg-white/5 rounded-3xl border border-white/5">
                            <p className="text-lg mb-2">No classes</p>
                            <p className="text-sm opacity-60">Enjoy your free time!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
