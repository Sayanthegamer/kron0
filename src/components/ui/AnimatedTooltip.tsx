import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({ 
    content, 
    children, 
    position = 'top' 
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const animations = {
        top: { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
        bottom: { initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
        left: { initial: { opacity: 0, x: 10, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
        right: { initial: { opacity: 0, x: -10, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } }
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={animations[position].initial}
                        animate={animations[position].animate}
                        exit={animations[position].initial}
                        className={`absolute z-[300] px-3 py-1.5 text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-md rounded-lg shadow-xl shadow-black/20 border border-white/10 whitespace-nowrap pointer-events-none ${positions[position]}`}
                    >
                        {content}
                        {/* Arrow */}
                        <div className={`absolute w-2 h-2 bg-slate-900/90 border-r border-b border-white/10 rotate-45 ${
                            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
                            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
                            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
                            'left-[-4px] top-1/2 -translate-y-1/2'
                        }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
