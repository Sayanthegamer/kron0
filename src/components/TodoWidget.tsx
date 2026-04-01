import React, { useState, useEffect } from 'react';
import { useTodo } from '../hooks/useTodo';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, TrendingUp, Trophy } from 'lucide-react';
import { RetryOperation } from './ErrorBoundary';
import { AnimatedTodoItem } from './todo/AnimatedTodoItem';
import { TodoInput } from './todo/TodoInput';
import { TodoFilters, type TodoFilterType } from './todo/TodoFilters';
import { TodoSkeleton } from './todo/TodoSkeleton';
import { ConfettiExplosion } from './ConfettiExplosion';

export const TodoWidget: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo, isSaving, isLoading, lastError, retryLastOperation } = useTodo();
    const [filter, setFilter] = useState<TodoFilterType>('all');
    const [showConfetti, setShowConfetti] = useState(false);
    const prevCompletedCountRef = React.useRef(0);

    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Detect completion for confetti
    useEffect(() => {
        const prevCount = prevCompletedCountRef.current;
        if (completedCount > prevCount && completedCount === totalCount && totalCount > 0) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }, 100);
            
            prevCompletedCountRef.current = completedCount;
            return () => clearTimeout(timer);
        }
        prevCompletedCountRef.current = completedCount;
    }, [completedCount, totalCount]);

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // Custom sort: Uncompleted first, then by date
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (a.completed === b.completed) return b.createdAt - a.createdAt;
        return a.completed ? 1 : -1;
    });

    const remainingTodos = todos.filter(t => !t.completed).length;

    return (
        <motion.div 
            className="glass-card p-6 rounded-2xl relative overflow-hidden group hover-lift border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Confetti Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <ConfettiExplosion active={showConfetti} />
            </div>

            {/* Decorative background element — CSS ambient glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none opacity-50 ambient-glow" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground leading-tight">Tasks</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{completedCount}/{totalCount} done</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {remainingTodos === 0 && todos.length > 0 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 font-bold text-xs shadow-lg shadow-green-500/10"
                        >
                            <Trophy size={14} className="fill-current" />
                            <span>All Done!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Input */}
            <TodoInput onAdd={addTodo} isSaving={isSaving} />

            {/* Filters */}
            {todos.length > 0 && (
                <TodoFilters filter={filter} onFilterChange={setFilter} />
            )}

            {/* Error State */}
            <AnimatePresence>
                {lastError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                                <AlertCircle size={16} />
                                <span>{lastError}</span>
                            </div>
                            <RetryOperation isRetrying={isSaving} onRetry={retryLastOperation} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Todo List */}
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar min-h-[100px]">
                {isLoading && todos.length === 0 ? (
                    <TodoSkeleton />
                ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                        {sortedTodos.map((todo, index) => (
                            <AnimatedTodoItem 
                                key={todo.id} 
                                todo={todo} 
                                index={index}
                                onToggle={toggleTodo} 
                                onDelete={deleteTodo} 
                            />
                        ))}
                    </AnimatePresence>
                )}

                {/* Empty States */}
                {!isLoading && sortedTodos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground"
                    >
                        {filter === 'all' && todos.length === 0 ? (
                            <>
                                <div className="mb-3 p-4 bg-muted/30 rounded-full floating-button">
                                    <Sparkles size={24} className="text-primary/50" />
                                </div>
                                <p className="font-medium text-foreground">No tasks yet</p>
                                <p className="text-xs max-w-[200px] mt-1">Add a task to get started on your productivity journey!</p>
                            </>
                        ) : (
                            <>
                                <p className="font-medium text-foreground">No {filter} tasks</p>
                                <p className="text-xs mt-1">Change the filter to see more tasks.</p>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
