import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, BarChart3, Clock, Plus, Sparkles, Coffee } from 'lucide-react';

interface EmptyStateProps {
  type?: 'timetable' | 'todos' | 'stats' | 'focus' | 'dashboard';
  title?: string;
  description?: string;
  icon?: 'calendar' | 'coffee' | 'sparkles' | 'check' | 'chart' | 'clock';
  action?: {
    label: string;
    onClick: () => void;
  };
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const illustrations: Record<string, { icon: React.ComponentType<{ className?: string }>; title: string; description: string; actionLabel?: string }> = {
  timetable: {
    icon: Calendar,
    title: 'No classes scheduled',
    description: 'Add your first class to get started with your schedule',
    actionLabel: 'Add Class',
  },
  todos: {
    icon: CheckSquare,
    title: 'No tasks yet',
    description: 'Create tasks to stay organized and focused',
    actionLabel: 'Add Task',
  },
  stats: {
    icon: BarChart3,
    title: 'No stats available',
    description: 'Complete focus sessions to see your productivity insights',
    actionLabel: 'Start Focusing',
  },
  focus: {
    icon: Clock,
    title: 'Ready to focus?',
    description: 'Start a focus session to boost your productivity',
    actionLabel: 'Start Session',
  },
  dashboard: {
    icon: Sparkles,
    title: 'All caught up!',
    description: 'No more classes for today. Enjoy your free time!',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  icon,
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  const config = type ? illustrations[type] : null;

  const displayTitle = title || config?.title || 'No data';
  const displayDescription = description || config?.description || '';
  const finalActionLabel = actionLabel || action?.label || config?.actionLabel;
  const finalActionClick = onAction || action?.onClick;

  const renderIcon = () => {
    const iconProps = { className: "text-primary w-10 h-10" };
    if (icon) {
      switch (icon) {
        case 'coffee': return <Coffee {...iconProps} />;
        case 'sparkles': return <Sparkles {...iconProps} />;
        case 'check': return <CheckSquare {...iconProps} />;
        case 'chart': return <BarChart3 {...iconProps} />;
        case 'clock': return <Clock {...iconProps} />;
        case 'calendar': default: return <Calendar {...iconProps} />;
      }
    }
    const FallbackIcon = config?.icon || Calendar;
    return <FallbackIcon {...iconProps} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass-card p-8 md:p-12 rounded-xl flex flex-col items-center justify-center text-center border-dashed border-border ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
      >
        {renderIcon()}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-foreground mb-3"
      >
        {displayTitle}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md mb-6"
      >
        {displayDescription}
      </motion.p>

      {finalActionLabel && finalActionClick && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={finalActionClick}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-smooth hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          <span>{finalActionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};
