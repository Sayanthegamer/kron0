import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    badge?: string;
    destructive?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ 
    title, 
    icon: Icon, 
    children, 
    badge,
    destructive
}) => {
    return (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`
                space-y-4 p-4 rounded-2xl border transition-all duration-300
                ${destructive 
                    ? 'border-destructive/20 bg-destructive/5' 
                    : 'border-border bg-card/50 hover:bg-card hover:shadow-lg hover:shadow-black/5'}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className={`p-2 rounded-lg ${destructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                            <Icon size={18} />
                        </div>
                    )}
                    <h3 className={`font-bold tracking-tight ${destructive ? 'text-destructive uppercase text-xs' : 'text-foreground'}`}>
                        {title}
                    </h3>
                </div>
                {badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                        {badge}
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {children}
            </div>
        </motion.section>
    );
};
