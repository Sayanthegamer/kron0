import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TodoCheckboxProps {
    checked: boolean;
    onChange: () => void;
    className?: string;
}

export const TodoCheckbox: React.FC<TodoCheckboxProps> = ({ checked, onChange, className }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={onChange}
            className={cn(
                "relative flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50",
                checked 
                    ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
                    : "border-muted-foreground/30 hover:border-primary/50 bg-transparent hover:bg-primary/5",
                className
            )}
            aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-white"
                initial={false}
                animate={checked ? "checked" : "unchecked"}
            >
                <motion.path
                    d="M20 6L9 17l-5-5"
                    fill="none"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                        checked: { 
                            pathLength: 1, 
                            opacity: 1,
                            transition: { 
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                delay: 0.05
                            } 
                        },
                        unchecked: { 
                            pathLength: 0, 
                            opacity: 0,
                            transition: { duration: 0.1 } 
                        }
                    }}
                />
            </motion.svg>
        </motion.button>
    );
};
