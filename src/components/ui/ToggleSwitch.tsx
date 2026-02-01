import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
    enabled, 
    onChange, 
    label, 
    description 
}) => {
    return (
        <div className="flex items-center justify-between gap-4 p-1">
            {(label || description) && (
                <div className="flex flex-col">
                    {label && <span className="font-medium text-foreground">{label}</span>}
                    {description && <span className="text-sm text-muted-foreground">{description}</span>}
                </div>
            )}
            <button
                onClick={() => onChange(!enabled)}
                className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 
                    focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${enabled ? 'toggle-enabled' : 'bg-muted'}
                `}
                role="switch"
                aria-checked={enabled}
            >
                <motion.span
                    animate={{ x: enabled ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg 
                        ring-0 transition duration-200 ease-in-out
                    `}
                />
            </button>
        </div>
    );
};
