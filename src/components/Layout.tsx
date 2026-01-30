import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Plus, Timer, LayoutGrid, PieChart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { SettingsModal } from './SettingsModal';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'week' | 'focus' | 'stats';
    onTabChange: (tab: 'dashboard' | 'week' | 'focus' | 'stats') => void;
    onAddClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onAddClick }) => {
    const { user, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [notificationCounts] = useState({ dashboard: 0, week: 0, focus: 0, stats: 2 });
    const dockRef = useRef<HTMLDivElement>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Enhanced Ambient Background Glows */}
            <motion.div
                animate={{
                    opacity: activeTab === 'focus' ? 0.6 : 0.3,
                    scale: activeTab === 'focus' ? 1.1 : 1,
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none will-change-transform"
            />
            <motion.div
                animate={{
                    opacity: activeTab === 'focus' ? 0.6 : 0.2,
                    scale: activeTab === 'focus' ? 1.05 : 1,
                    background: activeTab === 'focus' ? 'var(--secondary)' : 'var(--secondary)'
                }}
                transition={{ duration: 5, delay: 1, repeat: Infinity, repeatType: "mirror" }}
                className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none will-change-transform"
            />

            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <motion.div 
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <span className="text-white text-lg">⏳</span>
                    </motion.div>
                    <h1 className="text-xl font-bold tracking-tight text-glow">Kron0</h1>
                </div>
                {user && (
                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pr-1.5 shadow-xl hover-lift">
                        {/* User Profile Trigger for Settings */}
                        <motion.div
                            id="user-profile-trigger"
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center gap-3 cursor-pointer rounded-full pl-2 pr-2 py-1 transition-smooth focus-ring"
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start hidden sm:flex">
                                <span className="text-xs font-semibold leading-none">{user.displayName || 'User'}</span>
                                <span className="text-xs text-muted-foreground leading-none scale-90 origin-left mt-0.5">Settings</span>
                            </div>
                        </motion.div>
                        <div className="w-px h-6 bg-border mx-1" />
                        <motion.button
                            onClick={logout}
                            className="p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-smooth focus-ring"
                            title="Sign out"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <LogOut size={16} />
                        </motion.button>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 p-3 md:p-6 pb-28 overflow-y-auto w-full max-w-lg mx-auto z-0 custom-scrollbar scroll-smooth">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ 
                            duration: isMobile ? 0.2 : 0.3, 
                            ease: "easeOut" 
                        }}
                        className="animate-entrance"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Enhanced Floating Dock Navigation */}
            <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <motion.div 
                    ref={dockRef}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                        duration: 0.5, 
                        delay: 0.2,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    className={`bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-1 pointer-events-auto hover-lift ${isMobile ? 'gap-0.5' : 'gap-2'}`}
                    whileHover={{ scale: 1.02 }}
                >

                    <NavButton
                        id="nav-home"
                        active={activeTab === 'dashboard'}
                        onClick={() => onTabChange('dashboard')}
                        icon={<LayoutGrid size={isMobile ? 18 : 20} />}
                        label="Home"
                        badgeCount={notificationCounts.dashboard}
                        isHovered={hoveredTab === 'dashboard'}
                        onHover={() => setHoveredTab('dashboard')}
                        onLeave={() => setHoveredTab(null)}
                        isMobile={isMobile}
                    />

                    <NavButton
                        id="nav-week"
                        active={activeTab === 'week'}
                        onClick={() => onTabChange('week')}
                        icon={<Calendar size={isMobile ? 18 : 20} />}
                        label="Week"
                        badgeCount={notificationCounts.week}
                        isHovered={hoveredTab === 'week'}
                        onHover={() => setHoveredTab('week')}
                        onLeave={() => setHoveredTab(null)}
                        isMobile={isMobile}
                    />

                    {/* Enhanced FAB */}
                    <motion.button
                        id="nav-add-btn"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            boxShadow: '0 0 30px rgba(139, 47, 201, 0.5)'
                        }}
                        whileTap={{ 
                            scale: 0.9,
                            rotate: -5
                        }}
                        onClick={onAddClick}
                        className={`mx-1 md:mx-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl shadow-lg shadow-primary/40 border border-white/20 focus-ring ${isMobile ? 'p-2.5' : 'p-3.5'}`}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Plus size={isMobile ? 20 : 24} />
                    </motion.button>

                    <NavButton
                        id="nav-focus"
                        active={activeTab === 'focus'}
                        onClick={() => onTabChange('focus')}
                        icon={<Timer size={isMobile ? 18 : 20} />}
                        label="Focus"
                        badgeCount={notificationCounts.focus}
                        isHovered={hoveredTab === 'focus'}
                        onHover={() => setHoveredTab('focus')}
                        onLeave={() => setHoveredTab(null)}
                        isMobile={isMobile}
                    />

                    <NavButton
                        id="nav-stats"
                        active={activeTab === 'stats'}
                        onClick={() => onTabChange('stats')}
                        icon={<PieChart size={isMobile ? 18 : 20} />}
                        label="Stats"
                        badgeCount={notificationCounts.stats}
                        isHovered={hoveredTab === 'stats'}
                        onHover={() => setHoveredTab('stats')}
                        onLeave={() => setHoveredTab(null)}
                        isMobile={isMobile}
                    />

                </motion.div>
            </nav>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

interface NavButtonProps {
    id?: string;
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badgeCount?: number;
    isHovered?: boolean;
    onHover?: () => void;
    onLeave?: () => void;
    isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
    id, 
    active, 
    onClick, 
    icon, 
    label, 
    badgeCount = 0,
    isHovered = false,
    onHover,
    onLeave,
    isMobile = false
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        onClick();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
        >
            <button
                ref={buttonRef}
                id={id}
                onClick={handleRipple}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                className={`relative p-3 rounded-xl transition-all duration-300 group flex items-center justify-center focus-ring ${active ? 'text-white' : 'text-muted-foreground hover:text-white'
                    }`}
                style={{ willChange: 'transform' }}
            >
                {/* Active state glow */}
                {active && (
                    <>
                        <motion.div
                            layoutId="nav-glow"
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            style={{ filter: 'blur(10px)' }}
                        />
                        <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-white/10 rounded-xl border border-white/20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    </>
                )}

                {/* Hover scale effect */}
                <motion.div
                    className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                />

                <div className="relative z-10 flex flex-col items-center gap-1">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: isHovered ? 5 : 0 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {icon}
                    </motion.div>
                    
                    {/* Badge counter */}
                    {badgeCount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-lg"
                        >
                            {badgeCount > 99 ? '99+' : badgeCount}
                        </motion.div>
                    )}

                    {/* Tooltip */}
                    <AnimatePresence>
                        {isHovered && !isMobile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap border border-white/10 shadow-lg"
                            >
                                {label}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>
        </motion.div>
    );
};
