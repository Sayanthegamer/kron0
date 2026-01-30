import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { RetryOperation } from './ErrorBoundary';

export const TodoWidget: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo, isSaving, lastError, retryLastOperation } = useTodo();
    const [newItem, setNewItem] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            try {
                await addTodo(newItem.trim());
                setNewItem('');
            } catch (error) {
                // Error is handled by the context
                console.error('Failed to add todo:', error);
            }
        }
    };

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) return b.createdAt - a.createdAt;
        return a.completed ? 1 : -1;
    });

    const remainingTodos = todos.filter(t => !t.completed).length;

    return (
        <motion.div 
            className="glass-card p-6 rounded-xl relative overflow-hidden group hover-lift"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            whileHover={{ 
                y: -2,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
        >
            {/* Decorative background element */}
            <motion.div 
                className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-smooth"
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                }}
                transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-2xl" />
            </motion.div>

            {/* Enhanced Header */}
            <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <motion.h3 
                    className="text-xl font-bold text-foreground flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                >
                    <motion.span
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
                        Tasks
                    </motion.span>
                    <motion.span 
                        className="text-xs bg-primary/20 px-2.5 py-1 rounded-full text-primary font-semibold border border-primary/30"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            delay: 0.4,
                            type: "spring",
                            stiffness: 500,
                            damping: 15
                        }}
                        whileHover={{ 
                            scale: 1.1,
                            backgroundColor: 'rgba(139, 47, 201, 0.3)'
                        }}
                    >
                        {remainingTodos} remaining
                    </motion.span>
                </motion.h3>
                <AnimatePresence>
                    {remainingTodos === 0 && todos.length > 0 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 transition-colors"
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="text-green-400" size={14} />
                            </motion.div>
                            <span className="text-xs font-semibold text-green-400">All done!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Enhanced Add Task Form */}
            <motion.form 
                onSubmit={handleSubmit} 
                className="relative mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder="Add a new task..."
                        disabled={isSaving}
                        className={`w-full bg-black/5 dark:bg-black/20 border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-300 font-medium disabled:opacity-50 ${
                            isInputFocused 
                                ? 'border-primary/50 ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/10' 
                                : 'border-black/5 dark:border-white/10 hover:border-primary/20'
                        }`}
                    />
                    
                    {/* Animated border glow */}
                    {isInputFocused && (
                        <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-primary/30 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </motion.div>
                
                <motion.button
                    type="submit"
                    disabled={!newItem.trim() || isSaving}
                    className={`absolute right-2 top-2 p-2 rounded-lg transition-all duration-300 ${
                        newItem.trim() && !isSaving
                            ? 'bg-gradient-to-br from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/30'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                    whileHover={{ 
                        scale: newItem.trim() && !isSaving ? 1.1 : 1,
                        rotate: newItem.trim() && !isSaving ? 5 : 0
                    }}
                    whileTap={{ scale: newItem.trim() && !isSaving ? 0.9 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    {isSaving ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw size={18} />
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Plus size={18} />
                        </motion.div>
                    )}
                </motion.button>
            </motion.form>

            {/* Enhanced Error State */}
            <AnimatePresence>
                {lastError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <AlertCircle size={16} />
                                </motion.div>
                                <span className="text-sm font-medium">Error</span>
                            </div>
                            <RetryOperation isRetrying={isSaving} onRetry={retryLastOperation} />
                        </div>
                        <motion.p 
                            className="text-sm text-red-600 dark:text-red-300 mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {lastError}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Todo List */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {sortedTodos.map((todo, index) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, x: -30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: 30 }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeOut',
                                delay: index * 0.03,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            whileHover={{ 
                                x: 4,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className={`group/item flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                                todo.completed
                                    ? 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'
                                    : 'bg-white/40 dark:bg-white/10 border-black/5 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/15 hover:border-primary/20'
                            }`}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTodo(todo.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                    todo.completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-muted-foreground/30 hover:border-muted-foreground/50 text-transparent hover:border-primary/50'
                                }`}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: todo.completed ? 1 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                    <Check size={14} strokeWidth={3} />
                                </motion.div>
                            </motion.button>

                            <motion.span 
                                className={`flex-1 font-medium transition-all duration-300 ${
                                    todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                                }`}
                                layout
                            >
                                {todo.text}
                            </motion.span>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover/item:opacity-100 p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300"
                                initial={{ x: 10 }}
                                whileHover={{ 
                                    x: 0,
                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                    color: 'rgb(239, 68, 68)'
                                }}
                            >
                                <motion.div
                                    whileHover={{ rotate: 90 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Trash2 size={16} />
                                </motion.div>
                            </motion.button>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {todos.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                className="glass-card p-6 rounded-xl flex flex-col items-center justify-center text-center border-dashed border-border"
                            >
                                <motion.div 
                                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3"
                                    whileHover={{ 
                                        scale: 1.1,
                                        rotate: 5,
                                        backgroundColor: 'rgba(139, 47, 201, 0.3)'
                                    }}
                                    animate={{ 
                                        y: [0, -5, 0],
                                    }}
                                    transition={{ 
                                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                        rotate: { type: "spring", stiffness: 300 }
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="text-primary" size={24} />
                                    </motion.div>
                                </motion.div>
                                <motion.h4 
                                    className="font-semibold text-foreground mb-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    No tasks yet
                                </motion.h4>
                                <motion.p 
                                    className="text-sm text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Create tasks to stay organized and focused
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
