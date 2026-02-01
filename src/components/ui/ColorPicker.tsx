import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

const DEFAULT_COLORS = [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#6366f1', // indigo
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
            <div className="flex flex-wrap gap-3">
                {DEFAULT_COLORS.map((color) => (
                    <motion.button
                        key={color}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onChange(color)}
                        className={`
                            relative w-8 h-8 rounded-full border-2 transition-all duration-300
                            ${value === color ? 'border-foreground scale-110 shadow-lg' : 'border-transparent hover:border-foreground/30'}
                        `}
                        style={{ backgroundColor: color }}
                    >
                        {value === color && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center text-white"
                            >
                                <Check size={16} strokeWidth={3} />
                            </motion.div>
                        )}
                        {value === color && (
                            <motion.div
                                layoutId="color-glow"
                                className="absolute -inset-1 rounded-full opacity-50 blur-sm"
                                style={{ backgroundColor: color }}
                            />
                        )}
                    </motion.button>
                ))}
                
                {/* Custom Color Picker Input */}
                <div className="relative group">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-8 h-8 rounded-full bg-muted border-2 border-transparent hover:border-foreground/30 cursor-pointer overflow-hidden opacity-0 absolute inset-0 z-10"
                    />
                    <div 
                        className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors"
                        style={!DEFAULT_COLORS.includes(value) ? { backgroundColor: value } : {}}
                    >
                        {!DEFAULT_COLORS.includes(value) ? (
                            <Check size={16} strokeWidth={3} className="text-white" />
                        ) : (
                            <span className="text-xs font-bold">+</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
