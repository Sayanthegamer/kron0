import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface QuickAddButtonProps {
  onClick: () => void;
  label?: string;
  expanded?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({ 
  onClick, 
  label = 'Add Class',
  expanded = false 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isHovered]);

  return (
    <div className="relative inline-block">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap pointer-events-none z-50"
          >
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold focus-ring overflow-hidden ${
          expanded ? 'p-4 sm:px-6 sm:py-3 text-sm' : 'p-4'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          boxShadow: [
            '0 4px 14px 0 rgba(139, 47, 201, 0.39)',
            '0 8px 24px 0 rgba(139, 47, 201, 0.5)',
            '0 4px 14px 0 rgba(139, 47, 201, 0.39)',
          ]
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 260, damping: 20 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Gradient shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ 
            rotate: isHovered ? 90 : 0,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300,
            damping: 20
          }}
        >
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="x"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X size={expanded ? 18 : 20} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Plus size={expanded ? 18 : 20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label for expanded state */}
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="relative z-10 hidden sm:inline whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/30"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>

      {/* Floating animation effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          background: 'radial-gradient(circle, rgba(139, 47, 201, 0.2) 0%, transparent 70%)',
          filter: 'blur(10px)',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      />
    </div>
  );
};
