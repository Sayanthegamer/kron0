import React from 'react';

export const TodoSkeleton: React.FC = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div 
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 animate-pulse"
                >
                    <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
            ))}
        </div>
    );
};
