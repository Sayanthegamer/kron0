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
      className={`glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 border-border relative overflow-hidden ${className}`}
    >
      {/* Animated Icon Container — CSS float */}
      <motion.div 
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center mb-6 floating-button`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ rotate: { type: "spring", stiffness: 300 } }}
      >
        {/* Glow effect — CSS ambient */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} ambient-glow`}
          style={{ filter: 'blur(20px)' }}
        />

        {/* Icon — CSS gentle wobble */}
        <div className="relative z-10 text-primary animate-float-rotate">
          {getIcon()}
        </div>

        {/* Orbiting particles — CSS spin */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40 animate-spin-slow"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${30 + i * 10}px 0`,
              animationDuration: `${3 + i}s`,
              animationDelay: `${i * 0.5}s`,
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

      {/* Decorative blurs — CSS ambient */}
      <div
        className="absolute top-8 right-8 w-16 h-16 rounded-full bg-primary/5 ambient-glow"
        style={{ filter: 'blur(20px)' }}
      />
      <div
        className="absolute bottom-8 left-8 w-20 h-20 rounded-full bg-secondary/5 ambient-glow-delayed"
        style={{ filter: 'blur(25px)' }}
      />
    </motion.div>
  );
};
