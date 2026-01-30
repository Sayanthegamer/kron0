import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StaggeredListProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.08,
  direction = 'up',
  className = ''
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up': return { y: 30, x: 0 };
      case 'down': return { y: -30, x: 0 };
      case 'left': return { x: 30, y: 0 };
      case 'right': return { x: -30, y: 0 };
    }
  };

  const getExitOffset = () => {
    switch (direction) {
      case 'up': return { y: -30, x: 0 };
      case 'down': return { y: 30, x: 0 };
      case 'left': return { x: -30, y: 0 };
      case 'right': return { x: 30, y: 0 };
    }
  };

  const initialOffset = getInitialOffset();
  const exitOffset = getExitOffset();

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ 
              opacity: 0, 
              scale: 0.95,
              ...initialOffset
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              ...exitOffset
            }}
            transition={{ 
              delay: delay + (index * staggerDelay), 
              duration: 0.4,
              ease: [0.215, 0.61, 0.355, 1], // Custom easeOut
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            layout
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface StaggeredGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredGrid: React.FC<StaggeredGridProps> = ({ 
  children,
  columns = 2,
  gap = 4,
  delay = 0,
  staggerDelay = 0.05,
  className = ''
}) => {
  return (
    <div 
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 0.25}rem`
      }}
    >
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: -20
            }}
            transition={{ 
              delay: delay + (index * staggerDelay),
              duration: 0.3,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
              damping: 15
            }}
            layout
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
