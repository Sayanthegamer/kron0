import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Coffee, Sparkles, Plus } from 'lucide-react';

interface EmptyStateEnhancedProps {
  title: string;
  description: string;
  icon?: 'calendar' | 'coffee' | 'sparkles';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyStateEnhanced: React.FC<EmptyStateEnhancedProps> = ({
  title,
  description,
  icon = 'calendar',
  actionLabel,
  onAction,
  className = ''
}) => {
  const getIcon = () => {
    const iconProps = { className: 'w-12 h-12' };
    switch (icon) {
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'calendar':
      default:
        return <Calendar {...iconProps} />;
    }
  };

  const getGradient = () => {
    switch (icon) {
      case 'coffee':
        return 'from-amber-500/20 to-orange-500/20';
      case 'sparkles':
        return 'from-purple-500/20 to-pink-500/20';
      case 'calendar':
      default:
        return 'from-blue-500/20 to-cyan-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring",
        stiffness: 120,
        damping: 15
      }}
      className={`glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 border-border ${className}`}
    >
      {/* Animated Icon Container */}
      <motion.div 
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center mb-6`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { type: "spring", stiffness: 300 }
        }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ filter: 'blur(20px)' }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 text-primary"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {getIcon()}
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5
            }}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${30 + i * 10}px 0`,
            }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h3 
        className="text-2xl font-bold text-foreground mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p 
        className="text-muted-foreground max-w-md mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold focus-ring hover-lift"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Plus size={18} />
          <span>{actionLabel}</span>
        </motion.button>
      )}

      {/* Decorative elements */}
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 rounded-full bg-primary/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ filter: 'blur(20px)' }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-20 h-20 rounded-full bg-secondary/5"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ filter: 'blur(25px)' }}
      />
    </motion.div>
  );
};
