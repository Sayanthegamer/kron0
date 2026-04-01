import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface LiveBadgeProps {
  variant?: 'live' | 'next' | 'upcoming' | 'today';
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ 
  variant = 'live', 
  label,
  icon,
  className = '' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'live':
        return {
          bg: 'bg-primary/20',
          border: 'border-primary/50',
          text: 'text-primary',
          glow: 'shadow-[0_0_20px_rgba(139,47,201,0.4)]',
          pulse: true,
          defaultLabel: 'Live',
          defaultIcon: <Zap className="w-3 h-3" />
        };
      case 'next':
        return {
          bg: 'bg-secondary/20',
          border: 'border-secondary/50',
          text: 'text-secondary',
          glow: 'shadow-[0_0_15px_rgba(0,217,249,0.3)]',
          pulse: false,
          defaultLabel: 'Next',
          defaultIcon: null
        };
      case 'upcoming':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/50',
          text: 'text-blue-400',
          glow: '',
          pulse: false,
          defaultLabel: 'Upcoming',
          defaultIcon: null
        };
      case 'today':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          glow: '',
          pulse: false,
          defaultLabel: 'Today',
          defaultIcon: null
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 15,
        delay: 0.1
      }}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text} ${styles.glow} ${className}`}
    >
      {styles.pulse && (
        <div className="w-2 h-2 rounded-full bg-current micro-pulse" />
      )}
      
      {(icon || styles.defaultIcon) && (
        <div className={styles.pulse ? 'animate-float-rotate' : ''}>
          {icon || styles.defaultIcon}
        </div>
      )}
      
      <span className="text-xs font-bold uppercase tracking-wider">
        {label || styles.defaultLabel}
      </span>

      {/* Animated ring for live badge — pure CSS ripple */}
      {styles.pulse && (
        <div className="absolute inset-0 rounded-full border-2 border-current live-badge-pulse" />
      )}
    </motion.div>
  );
};
