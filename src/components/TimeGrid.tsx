import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Play } from 'lucide-react';
import { format, parse, isWithinInterval, set, differenceInMinutes } from 'date-fns';
import type { TimeTableEntry } from '../types';

interface TimeGridProps {
    entries: TimeTableEntry[];
    onEntryClick: (entry: TimeTableEntry) => void;
    onAddEntry?: (time: string) => void;
}

const HOURS = [
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
];

export const TimeGrid: React.FC<TimeGridProps> = ({ entries, onEntryClick, onAddEntry }) => {
    const [now, setNow] = useState(new Date());
    const [currentTimePosition, setCurrentTimePosition] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentNow = new Date();
            setNow(currentNow);

            // Calculate position
            const hours = currentNow.getHours();
            const minutes = currentNow.getMinutes();
            const totalMinutes = (hours - 6) * 60 + minutes;
            const position = (totalMinutes / 960) * 100; // 960 = 16 hours * 60 minutes
            setCurrentTimePosition(Math.max(0, Math.min(100, position)));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate current and next classes
    const currentClass = entries.find(entry => {
        const start = parse(entry.startTime, 'HH:mm', now);
        const end = parse(entry.endTime, 'HH:mm', now);
        return isWithinInterval(now, { start, end });
    });

    const nextClass = entries.find(entry => {
        const start = parse(entry.startTime, 'HH:mm', now);
        return now < start;
    });

    // Get class height based on duration
    const getClassHeight = (entry: TimeTableEntry) => {
        const start = parse(entry.startTime, 'HH:mm', now);
        const end = parse(entry.endTime, 'HH:mm', now);
        const duration = differenceInMinutes(end, start);
        return `${duration}px`; // 1 minute = 1px height
    };

    // Get class top position
    const getClassTop = (entry: TimeTableEntry) => {
        const start = parse(entry.startTime, 'HH:mm', now);
        const hours = start.getHours();
        const minutes = start.getMinutes();
        const totalMinutes = (hours - 6) * 60 + minutes;
        return `${totalMinutes}px`;
    };

    const handleSlotClick = (time: string) => {
        if (onAddEntry) {
            onAddEntry(time);
        }
    };

    return (
        <div className="relative h-full overflow-y-auto custom-scrollbar" ref={gridRef}>
            <div className="relative min-h-[1000px] pb-20">
                {/* Time Labels */}
                <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-border">
                    {HOURS.map((hour) => (
                        <div
                            key={hour}
                            className="absolute left-2 text-xs text-muted-foreground -translate-y-1/2"
                            style={{ top: `${(parseInt(hour.split(':')[0]) - 6) * 60}px` }}
                        >
                            {format(parse(hour, 'H:mm', now), 'ha')}
                        </div>
                    ))}
                </div>

                {/* Grid Lines */}
                <div className="absolute left-16 right-0 top-0 bottom-0">
                    {HOURS.map((hour) => (
                        <div
                            key={hour}
                            className="absolute left-0 right-0 border-t border-border/50"
                            style={{ top: `${(parseInt(hour.split(':')[0]) - 6) * 60}px` }}
                        >
                            {parseInt(hour) === new Date().getHours() && (
                                <motion.div
                                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                                    animate={{
                                        opacity: [0.3, 0.5, 0.3]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    {/* Current Time Indicator */}
                    <motion.div
                        className="absolute left-0 right-0 z-10 time-now"
                        style={{ top: `${currentTimePosition}%` }}
                        animate={{
                            top: `${currentTimePosition}%`
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="flex-1 h-0.5 bg-primary" />
                            <div className="ml-2 px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">
                                {format(now, 'h:mm a')}
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Time Slots */}
                    {HOURS.map((hour, hourIndex) => {
                        const hourStart = parseInt(hour.split(':')[0]);
                        return (
                            <React.Fragment key={hour}>
                                {[0, 15, 30, 45].map((minute) => {
                                    const timeString = `${hourStart.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                                    const topPosition = (hourIndex * 60 + minute);

                                    // Check if this slot overlaps with any class
                                    const isOverlapping = entries.some(entry => {
                                        const start = parse(entry.startTime, 'HH:mm', now);
                                        const end = parse(entry.endTime, 'HH:mm', now);
                                        const slotStart = set(now, { hours: hourStart, minutes: minute });
                                        return isWithinInterval(slotStart, { start, end });
                                    });

                                    if (isOverlapping) return null;

                                    return (
                                        <motion.button
                                            key={`${hour}-${minute}`}
                                            className={`absolute left-16 right-0 border-l border-border/20 time-slot transition-all ${
                                                hoveredSlot === timeString ? 'border-l-primary' : ''
                                            }`}
                                            style={{
                                                top: `${topPosition}px`,
                                                height: '15px'
                                            }}
                                            onHoverStart={() => setHoveredSlot(timeString)}
                                            onHoverEnd={() => setHoveredSlot(null)}
                                            onClick={() => handleSlotClick(timeString)}
                                            whileHover={{
                                                backgroundColor: 'hsl(var(--primary) / 0.05)',
                                                scale: 1.002
                                            }}
                                        >
                                            <div className="time-slot-preview" />
                                            <AnimatePresence>
                                                {hoveredSlot === timeString && onAddEntry && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 quick-add-reveal"
                                                    >
                                                        <div className="p-1.5 rounded-lg bg-primary text-white shadow-lg">
                                                            <Plus size={14} />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}

                    {/* Class Blocks */}
                    <AnimatePresence mode="popLayout">
                        {entries.map((entry) => {
                            const isCurrent = currentClass?.id === entry.id;
                            const isNext = nextClass?.id === entry.id;

                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    transition={{
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    style={{
                                        position: 'absolute',
                                        left: '68px',
                                        right: '16px',
                                        top: getClassTop(entry),
                                        height: getClassHeight(entry),
                                        zIndex: isCurrent ? 20 : isNext ? 15 : 10
                                    }}
                                    className="group"
                                >
                                    {/* Enhanced Class Block */}
                                    <motion.div
                                        className={`
                                            relative h-full rounded-xl overflow-hidden cursor-pointer
                                            transition-all duration-300
                                            ${isCurrent ? 'class-current class-glow' : ''}
                                            ${isNext ? 'ring-2 ring-secondary/50' : ''}
                                            glass-card
                                        `}
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: isCurrent
                                                ? '0 0 30px -5px rgba(139, 47, 201, 0.6)'
                                                : '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                                        }}
                                        onClick={() => onEntryClick(entry)}
                                    >
                                        {/* Status-specific gradient background */}
                                        <div className={`
                                            absolute inset-0 transition-opacity duration-300
                                            ${isCurrent
                                                ? 'class-gradient-primary'
                                                : isNext
                                                ? 'class-gradient-secondary'
                                                : 'class-gradient-accent'
                                            }
                                        `} />

                                        {/* Color accent on left side */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1.5"
                                            style={{
                                                backgroundColor: entry.color || 'var(--primary)'
                                            }}
                                        />

                                        {/* Current class animated progress bar */}
                                        {isCurrent && (
                                            <motion.div
                                                className="absolute top-0 left-0 right-0 h-1 bg-primary"
                                                animate={{
                                                    scaleX: [
                                                        0,
                                                        (now.getTime() - parse(entry.startTime, 'HH:mm', now).getTime()) /
                                                        (parse(entry.endTime, 'HH:mm', now).getTime() - parse(entry.startTime, 'HH:mm', now).getTime())
                                                    ]
                                                }}
                                                transition={{ duration: 60, ease: "linear" }}
                                                style={{ transformOrigin: 'left' }}
                                            />
                                        )}

                                        {/* Content */}
                                        <div className="relative z-10 p-3 h-full flex flex-col justify-center">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <motion.h4
                                                        className="text-sm font-bold text-foreground truncate"
                                                        whileHover={{ x: 2 }}
                                                    >
                                                        {entry.subject}
                                                    </motion.h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                        <Clock size={12} />
                                                        <span>
                                                            {format(parse(entry.startTime, 'HH:mm', now), 'h:mm a')} - {format(parse(entry.endTime, 'HH:mm', now), 'h:mm a')}
                                                        </span>
                                                        {entry.location && (
                                                            <span className="truncate">· {entry.location}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                {isCurrent && (
                                                    <motion.div
                                                        className="px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/50 text-[10px] font-bold uppercase tracking-wider live-now-indicator"
                                                        animate={{
                                                            scale: [1, 1.1, 1],
                                                            opacity: [1, 0.8, 1]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Play size={10} />
                                                            <span>LIVE</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {isNext && !isCurrent && (
                                                    <motion.div
                                                        className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/50 text-[10px] font-bold uppercase tracking-wider"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        Next
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Time remaining for current class */}
                                            {isCurrent && (
                                                <motion.div
                                                    className="absolute bottom-2 right-2 text-[10px] text-primary font-semibold"
                                                    animate={{
                                                        opacity: [1, 0.7, 1]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity
                                                    }}
                                                >
                                                    {Math.max(0, Math.floor(
                                                        (parse(entry.endTime, 'HH:mm', now).getTime() - now.getTime()) / 60000
                                                    ))}m left
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Hover reveal quick actions */}
                                        <motion.div
                                            className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={false}
                                            animate={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                        >
                                            <div className="p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-sm">
                                                <MoreHorizontal size={14} />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Break Indicators between classes */}
                    {entries.map((entry, index) => {
                        if (index === entries.length - 1) return null;

                        const currentEnd = parse(entry.endTime, 'HH:mm', now);
                        const nextStart = parse(entries[index + 1].startTime, 'HH:mm', now);
                        const breakMinutes = differenceInMinutes(nextStart, currentEnd);

                        if (breakMinutes <= 0) return null;

                        const topPosition = (currentEnd.getHours() - 6) * 60 + currentEnd.getMinutes();

                        return (
                            <motion.div
                                key={`break-${entry.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    left: '68px',
                                    right: '16px',
                                    top: `${topPosition}px`,
                                    height: `${breakMinutes}px`,
                                    minHeight: '30px'
                                }}
                                className="break-style rounded-lg flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                        {breakMinutes >= 30 ? 'Break' : 'Short break'}
                                    </div>
                                    <div className="text-xs font-semibold text-muted-foreground">
                                        {breakMinutes}m
                                    </div>
                                    {breakMinutes >= 15 && (
                                        <motion.div
                                            className="mt-1 flex items-center justify-center gap-1 text-[10px] text-secondary"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Play size={8} />
                                            <span>Focus session?</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
