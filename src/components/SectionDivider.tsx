import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
  label: string;
  icon?: React.ReactNode;
  onToggle?: () => void;
  isExpanded?: boolean;
  count?: number;
  animated?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  label, 
  icon,
  onToggle,
  isExpanded = true,
  count,
  animated = true
}) => {
  return (
    <motion.div 
      className="py-4 flex items-center gap-3"
      initial={animated ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left line */}
      <motion.div 
        className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border relative overflow-hidden"
        initial={animated ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: 'left' }}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Center content */}
      {onToggle ? (
        <motion.button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer select-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-current"
            >
              {icon}
            </motion.div>
          )}
          
          <span className="uppercase tracking-wider font-semibold">
            {label}
          </span>
          
          {count !== undefined && (
            <motion.span 
              className="px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground text-[10px] font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
            >
              {count}
            </motion.span>
          )}
        </motion.button>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon && (
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-current"
            >
              {icon}
            </motion.div>
          )}
          
          <span className="uppercase tracking-wider font-semibold">
            {label}
          </span>
          
          {count !== undefined && (
            <motion.span 
              className="px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground text-[10px] font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
            >
              {count}
            </motion.span>
          )}
        </div>
      )}

      {/* Right line */}
      <motion.div 
        className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border relative overflow-hidden"
        initial={animated ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: 'right' }}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 h-full bg-gradient-to-l from-transparent via-secondary/30 to-transparent"
          animate={{
            x: ['100%', '-200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
};
