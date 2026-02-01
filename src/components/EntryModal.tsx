import React, { useState, useEffect } from 'react';
import type { TimeTableEntry, DayOfWeek } from '../types';
import { Trash2, Calendar, Clock, MapPin, Type, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimetable } from '../hooks/useTimetable';
import { AnimatedModal, FormInput, ColorPicker, DateTimePicker, AnimatedTooltip } from './ui';

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: Omit<TimeTableEntry, 'id'> | TimeTableEntry) => void;
    onDelete?: (id: string) => void;
    initialData?: TimeTableEntry | null;
    defaultDay?: DayOfWeek;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData, defaultDay }) => {
    const { isSaving } = useTimetable();
    const [formData, setFormData] = useState<Partial<TimeTableEntry>>({
        days: defaultDay ? [defaultDay] : ['Monday'],
        startTime: '09:00',
        endTime: '10:00',
        subject: '',
        location: '',
        color: '#3b82f6'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Reset form when modal opens
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                days: defaultDay ? [defaultDay] : ['Monday'],
                startTime: '09:00',
                endTime: '10:00',
                subject: '',
                location: '',
                color: '#3b82f6'
            });
        }
        setErrors({});
        setTouched({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const validateField = (name: string, value: string | string[] | undefined) => {
        switch (name) {
            case 'subject': {
                const strValue = typeof value === 'string' ? value : '';
                if (!strValue || strValue.trim().length === 0) return 'Subject is required';
                if (strValue.trim().length < 2) return 'Subject must be at least 2 characters';
                return '';
            }
            case 'days':
                if (!value || value.length === 0) return 'Select at least one day';
                return '';
            case 'startTime':
                if (!value) return 'Start time is required';
                return '';
            case 'endTime':
                if (!value) return 'End time is required';
                if (formData.startTime && value <= formData.startTime) {
                    return 'End time must be after start time';
                }
                return '';
            default:
                return '';
        }
    };

    const handleBlur = (name: string, value: string | string[] | undefined) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (name: string, value: string | string[] | undefined) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const toggleDay = (day: DayOfWeek) => {
        setFormData(prev => {
            const currentDays = prev.days || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...prev, days: newDays };
        });
        if (touched.days) {
            const newDays = (formData.days || []).includes(day)
                ? (formData.days || []).filter(d => d !== day)
                : [...(formData.days || []), day];
            const error = validateField('days', newDays);
            setErrors(prev => ({ ...prev, days: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: Record<string, string> = {};
        newErrors.subject = validateField('subject', formData.subject);
        newErrors.days = validateField('days', formData.days);
        newErrors.startTime = validateField('startTime', formData.startTime);
        newErrors.endTime = validateField('endTime', formData.endTime);

        setErrors(newErrors);
        setTouched({ subject: true, days: true, startTime: true, endTime: true });

        const hasErrors = Object.values(newErrors).some(error => error);
        if (hasErrors) return;

        try {
            await onSave(formData as TimeTableEntry);
            onClose();
        } catch (error) {
            // Error is handled by the context
            console.error('Save failed:', error);
        }
    };

    const hasError = (name: string) => touched[name] && errors[name];
    const errorBorder = (name: string) => hasError(name) ? 'border-red-400 focus:ring-red-400/20' : 'focus:border-primary focus:ring-primary/20';

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Class' : 'Add New Class'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div className="space-y-1">
                    <FormInput
                        id="subject"
                        label="Subject Name"
                        value={formData.subject}
                        onChange={e => handleChange('subject', e.target.value)}
                        onBlur={() => handleBlur('subject', formData.subject)}
                        error={errors.subject}
                        touched={touched.subject}
                        placeholder="e.g. Advanced Mathematics"
                        autoComplete="off"
                    />
                </div>

                {/* Days Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2">
                        <Calendar size={16} />
                        Repeat on
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS.map((day, idx) => {
                            const isSelected = formData.days?.includes(day);
                            return (
                                <motion.button
                                    key={day}
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleDay(day)}
                                    className={`
                                        px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border
                                        ${isSelected 
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105' 
                                            : 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/50'}
                                    `}
                                >
                                    {day.slice(0, 3)}
                                </motion.button>
                            );
                        })}
                    </div>
                    <AnimatePresence>
                        {touched.days && errors.days && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-red-500 pl-1"
                            >
                                {errors.days}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <DateTimePicker
                        label="Start Time"
                        type="time"
                        value={formData.startTime || ''}
                        onChange={val => handleChange('startTime', val)}
                        error={errors.startTime}
                        touched={touched.startTime}
                    />
                    <DateTimePicker
                        label="End Time"
                        type="time"
                        value={formData.endTime || ''}
                        onChange={val => handleChange('endTime', val)}
                        error={errors.endTime}
                        touched={touched.endTime}
                    />
                </div>

                {/* Location */}
                <FormInput
                    id="location"
                    label="Location"
                    value={formData.location}
                    onChange={e => handleChange('location', e.target.value)}
                    placeholder="e.g. Room 302, Building B"
                    autoComplete="off"
                />

                {/* Color Picker */}
                <ColorPicker
                    label="Theme Color"
                    value={formData.color || '#3b82f6'}
                    onChange={color => handleChange('color', color)}
                />

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                    {initialData && onDelete && (
                        <AnimatedTooltip content="Permanently delete this class">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                disabled={isSaving}
                                onClick={async () => { 
                                    try {
                                        await onDelete(initialData.id!); 
                                        onClose();
                                    } catch (error) {
                                        console.error('Delete failed:', error);
                                    }
                                }}
                                className="p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 flex items-center justify-center min-w-[60px]"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Trash2 size={20} />
                                )}
                            </motion.button>
                        </AnimatedTooltip>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSaving}
                        className={`
                            flex-1 p-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 
                            hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2
                            ${isSaving ? 'button-loading' : ''}
                        `}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{initialData ? 'Update Class' : 'Create Class'}</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </AnimatedModal>
    );
};
