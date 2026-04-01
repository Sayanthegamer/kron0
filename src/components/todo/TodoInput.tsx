import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TodoInputProps {
    onAdd: (text: string) => Promise<void>;
    isSaving: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd, isSaving }) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            try {
                await onAdd(text.trim());
                setText('');
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 2000);
            } catch {
                // Error handling is managed by parent
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative mb-6">
            <motion.div
                className="relative"
                animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Add a new task..."
                    disabled={isSaving}
                    className={cn(
                        "w-full bg-black/5 dark:bg-black/20 border rounded-xl px-4 py-3.5 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-300 font-medium disabled:opacity-50",
                        isFocused 
                            ? "border-primary/50 ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/5" 
                            : "border-black/5 dark:border-white/10 hover:border-primary/20"
                    )}
                />
                
                {/* Border Glow — CSS */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-primary/30 pointer-events-none z-10 animate-pulse-glow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.button
                type="submit"
                disabled={!text.trim() || isSaving}
                className={cn(
                    "absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg transition-all duration-300 z-20",
                    text.trim() && !isSaving
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                whileHover={text.trim() && !isSaving ? { scale: 1.1, rotate: 90 } : {}}
                whileTap={text.trim() && !isSaving ? { scale: 0.9 } : {}}
            >
                <AnimatePresence mode="wait">
                    {isSaving ? (
                        <div key="loading" className="animate-spin-smooth">
                            <Loader2 size={20} />
                        </div>
                    ) : justAdded ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="add"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Plus size={20} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </form>
    );
};
