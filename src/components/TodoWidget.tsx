import React, { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';

export const TodoWidget: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodo();
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            addTodo(newItem.trim());
            setNewItem('');
        }
    };

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) return b.createdAt - a.createdAt;
        return a.completed ? 1 : -1;
    });

    return (
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-2xl" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span>Tasks</span>
                <span className="text-xs bg-muted/50 px-2 py-1 rounded-full text-muted-foreground font-normal">
                    {todos.filter(t => !t.completed).length} Remaining
                </span>
            </h3>

            <form onSubmit={handleSubmit} className="relative mb-6">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
                <button
                    type="submit"
                    className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${newItem.trim()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                >
                    <Plus size={18} />
                </button>
            </form>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {sortedTodos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`group/item flex items-center gap-3 p-3 rounded-xl transition-all border ${todo.completed
                                ? 'bg-black/5 dark:bg-white/5 border-transparent'
                                : 'bg-white/40 dark:bg-white/10 border-black/5 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/15'
                                }`}
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'border-muted-foreground/30 hover:border-muted-foreground/50 text-transparent'
                                    }`}
                            >
                                <Check size={14} strokeWidth={3} />
                            </button>

                            <span className={`flex-1 font-medium transition-all ${todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                                }`}>
                                {todo.text}
                            </span>

                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover/item:opacity-100 p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}

                    {todos.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-muted-foreground"
                        >
                            <p>No tasks yet. Stay focused!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
