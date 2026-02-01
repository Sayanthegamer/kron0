import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    touched?: boolean;
    success?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    error, 
    touched, 
    success,
    id,
    className = '',
    ...props 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = touched && error;

    return (
        <div className="space-y-1.5 w-full">
            <div className="relative">
                <motion.label
                    htmlFor={id}
                    initial={false}
                    animate={{
                        y: isFocused || props.value ? -24 : 0,
                        scale: isFocused || props.value ? 0.85 : 1,
                        color: hasError ? 'rgb(239, 68, 68)' : isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                    }}
                    className="absolute left-3 top-3 pointer-events-none transition-colors duration-200 origin-left"
                >
                    {label}
                </motion.label>
                <input
                    id={id}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`
                        w-full p-3 rounded-xl bg-muted/50 border transition-all duration-300 outline-none
                        ${hasError ? 'error-field' : isFocused ? 'form-input-focus ring-4 ring-primary/10' : 'border-border hover:border-border/80'}
                        ${className}
                    `}
                    {...props}
                />
                
                <AnimatePresence>
                    {success && !hasError && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-3 text-green-500"
                        >
                            <CheckCircle2 size={20} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="popLayout">
                {hasError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center gap-1.5 text-xs text-red-500 pl-1"
                    >
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
