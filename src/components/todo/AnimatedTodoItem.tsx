import React from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { TodoItem } from '../../types';
import { TodoCheckbox } from './TodoCheckbox';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AnimatedTodoItemProps {
    todo: TodoItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

export const AnimatedTodoItem: React.FC<AnimatedTodoItemProps> = ({ todo, onToggle, onDelete, index }) => {
    const x = useMotionValue(0);
    const controls = useAnimation();
    
    // Swipe delete visuals
    const opacity = useTransform(x, [-50, -100], [0, 1]);
    const deleteIconScale = useTransform(x, [-50, -100], [0.5, 1.2]);
    const color = useTransform(x, [-50, -100], ["#ef4444", "#dc2626"]);
    
    const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -100) {
            // Swipe left to delete
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
            onDelete(todo.id);
        } else {
            // Reset
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    return (
        <motion.div 
            layout
            className="relative mb-2 group/item"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            whileHover={{ scale: 1.01 }}
        >
            {/* Delete Background for swipe */}
            <motion.div 
                className="absolute inset-y-0 right-0 left-0 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-end px-4 overflow-hidden z-0"
                style={{ opacity }}
            >
                <motion.div style={{ scale: deleteIconScale, color }}>
                    <Trash2 size={20} />
                </motion.div>
            </motion.div>

            {/* Main Item */}
            <motion.div
                className={cn(
                    "relative z-10 flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 border",
                    todo.completed
                        ? "bg-black/5 dark:bg-white/5 border-transparent opacity-60"
                        : "bg-white/40 dark:bg-white/10 border-black/5 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/15 hover:border-primary/20 hover:shadow-sm"
                )}
                style={{ x, touchAction: "pan-y" }}
                drag="x"
                dragControls={undefined}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.5, right: 0.05 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                whileTap={{ scale: 0.98 }}
            >
                <TodoCheckbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
                
                <motion.span 
                    className={cn(
                        "flex-1 font-medium transition-all duration-300 select-none truncate cursor-pointer",
                        todo.completed ? "text-muted-foreground line-through decoration-2 decoration-muted-foreground/50" : "text-foreground"
                    )}
                    onClick={() => onToggle(todo.id)}
                    layout
                >
                    {todo.text}
                </motion.span>

                <motion.button
                     onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
                     className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all focus:opacity-100 md:block hidden"
                     whileHover={{ scale: 1.1, rotate: 10 }}
                     whileTap={{ scale: 0.9 }}
                     aria-label="Delete task"
                >
                    <Trash2 size={16} />
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
