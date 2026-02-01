import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CheckCircle2, Circle, ListFilter } from 'lucide-react';

export type TodoFilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
    filter: TodoFilterType;
    onFilterChange: (filter: TodoFilterType) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({ filter, onFilterChange }) => {
    const filters: { id: TodoFilterType; label: string; icon: React.ReactNode }[] = [
        { id: 'all', label: 'All', icon: <ListFilter size={14} /> },
        { id: 'active', label: 'Active', icon: <Circle size={14} /> },
        { id: 'completed', label: 'Done', icon: <CheckCircle2 size={14} /> },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg mb-4">
            {filters.map((f) => (
                <button
                    key={f.id}
                    onClick={() => onFilterChange(f.id)}
                    className={cn(
                        "relative flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
                        filter === f.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {filter === f.id && (
                        <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-primary rounded-md shadow-sm shadow-primary/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                        {f.icon}
                        {f.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
