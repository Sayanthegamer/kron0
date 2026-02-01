import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ContextMenuItem {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
}

interface ContextMenuProps {
    items: ContextMenuItem[];
    children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
    const [menuData, setMenuData] = useState<{ x: number, y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Ensure menu stays within viewport
        const x = Math.min(e.clientX, window.innerWidth - 180);
        const y = Math.min(e.clientY, window.innerHeight - 200);
        
        setMenuData({ x, y });
    };

    useEffect(() => {
        const handleClick = () => setMenuData(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div onContextMenu={handleContextMenu} className="relative h-full w-full">
            {children}
            <AnimatePresence>
                {menuData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ left: menuData.x, top: menuData.y }}
                        className="fixed z-[500] min-w-[160px] bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl py-1.5 overflow-hidden"
                    >
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    item.onClick();
                                    setMenuData(null);
                                }}
                                disabled={item.disabled}
                                className={`
                                    w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-all text-left
                                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 
                                      item.destructive ? 'text-red-500 hover:bg-red-500/10' : 'text-foreground hover:menu-item-hover'}
                                `}
                            >
                                {item.icon && <item.icon size={16} />}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
