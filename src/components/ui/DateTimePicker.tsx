import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DateTimePickerProps {
    label: string;
    type: 'date' | 'time';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    touched?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    type,
    value,
    onChange,
    error,
    touched
}) => {
    const hasError = touched && error;

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium text-muted-foreground ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    {type === 'date' ? <Calendar size={18} /> : <Clock size={18} />}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border transition-all duration-300 outline-none
                        appearance-none cursor-pointer
                        ${hasError ? 'border-red-500 animate-[field-shake_0.4s_ease-in-out]' : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-border/80'}
                    `}
                />
                {/* Subtle highlight on hover */}
                <motion.div 
                    className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 pointer-events-none transition-opacity"
                    whileHover={{ opacity: 1 }}
                />
            </div>
            {hasError && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 pl-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};
