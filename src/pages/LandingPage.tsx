import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    ArrowRight, 
    Clock, 
    Calendar, 
    BarChart3, 
    Shield, 
    Zap, 
    Layers, 
    MousePointer2, 
    Sparkles
} from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="min-h-screen bg-[#020203] text-foreground flex flex-col relative overflow-x-hidden selection:bg-primary/30">
            
            {/* Immersive Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 dot-grid opacity-30" />
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020203]/50 to-[#020203]" />
            </div>

            {/* Premium Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#020203]/40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Kron0
                        </span>
                    </motion.div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
                        <button 
                            onClick={onGetStarted}
                            className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-all font-semibold"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-8 tracking-wider uppercase">
                            <Sparkles size={14} className="animate-pulse" /> v2.0 Performance Update
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-[0.9] mb-8 max-w-5xl">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                The high-performance 
                            </span>
                            <br />
                            <span className="text-glow text-primary italic">productivity</span> engine.
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            A beautifully engineered terminal for your time. Optimize classes, deep-work sessions, and daily targets with military precision.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onGetStarted}
                                className="group relative px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 overflow-hidden text-lg"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                <span className="relative flex items-center gap-3">
                                    Start Crafting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                            <button className="flex items-center gap-2 px-8 py-5 text-muted-foreground hover:text-white transition-colors font-bold">
                                <MousePointer2 size={18} /> View Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Product Preview Mockup */}
                    <motion.div 
                        style={{ y: y1, opacity }}
                        className="relative w-full max-w-6xl mt-12 mb-32 perspective-1000"
                    >
                        <div className="glass-premium rounded-3xl p-2 md:p-4 rotate-x-6 transform-gpu shadow-[0_0_50px_rgba(139,47,201,0.2)] border-t border-white/20">
                            <div className="bg-[#0f0f15] rounded-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] flex flex-col border border-white/5">
                                {/* Mock UI Header */}
                                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    <div className="ml-4 h-5 w-32 bg-white/10 rounded-md" />
                                </div>
                                {/* Mock UI Content */}
                                <div className="flex-1 flex p-6 gap-6 overflow-hidden">
                                    <div className="w-64 hidden md:flex flex-col gap-4">
                                        <div className="h-40 bg-primary/20 rounded-xl animate-pulse" />
                                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-6">
                                        <div className="h-10 w-1/3 bg-white/10 rounded-lg" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-white/5 rounded-xl border border-white/5" />
                                            <div className="h-32 bg-secondary/20 rounded-xl border border-secondary/20" />
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Labels for Mockup */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            className="absolute -top-10 -right-10 hidden lg:flex flex-col items-center gap-2 p-4 glass-premium rounded-2xl animate-floating"
                        >
                            <Zap className="text-secondary" />
                            <span className="text-xs font-bold uppercase tracking-tighter">Hyper-fast Sync</span>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Bento features Section */}
                <section id="features" className="max-w-7xl mx-auto mt-20">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Precision Engineered</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to reclaim your attention and dominate your schedule.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
                        {/* Large Card: Focus Engine */}
                        <BentoCard 
                            className="md:col-span-8 md:row-span-2"
                            icon={<Clock className="w-8 h-8 text-primary" />}
                            title="The Focus Engine"
                            description="Visual Pomodoro timers integrated directly with your task list. Track flow state and analyze peak productivity hours."
                            preview={<div className="mt-8 flex items-end gap-2 h-full"><div className="w-full h-[60%] bg-primary/20 rounded-t-xl" /><div className="w-full h-[80%] bg-primary/40 rounded-t-xl" /><div className="w-full h-[100%] bg-primary rounded-t-xl" /></div>}
                        />

                        {/* Mid Card: Calendar */}
                        <BentoCard 
                            className="md:col-span-4"
                            icon={<Calendar className="w-6 h-6 text-secondary" />}
                            title="Zero-friction Schedule"
                            description="Import your class timetable and see what is live now."
                        />

                        {/* Mid Card: Security */}
                        <BentoCard 
                            className="md:col-span-4" 
                            icon={<Shield className="w-6 h-6 text-green-400" />}
                            title="Military-grade Privacy"
                            description="Your data is encrypted and synced only to your private Firestore instance."
                        />

                        {/* Rect Card: Analytics */}
                        <BentoCard 
                            className="md:col-span-4 md:row-span-2"
                            icon={<BarChart3 className="w-8 h-8 text-secondary" />}
                            title="Deep Insights"
                            description="Visualize your habits. Know which days you work hardest and where you lose time."
                            preview={<div className="mt-6 flex flex-col gap-2"><div className="h-2 w-full bg-white/5 rounded-full"><div className="h-full w-[70%] bg-secondary rounded-full" /></div><div className="h-2 w-full bg-white/5 rounded-full"><div className="h-full w-[45%] bg-secondary/60 rounded-full" /></div></div>}
                        />

                        {/* Wide Card: Quick Entry */}
                        <BentoCard 
                            className="md:col-span-8"
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Lightning Tasks"
                            description="Quick-add tasks from any screen. Keyboard-first workflow for speed."
                        />
                    </div>
                </section>

                {/* Final Call to Action */}
                <section className="max-w-4xl mx-auto mt-40 text-center py-20 rounded-[3rem] bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Ready to focus?</h2>
                        <p className="text-white/80 text-xl mb-10 max-w-lg">Join students worldwide mastering their time with Kron0 v2. Free to use.</p>
                        <button 
                            onClick={onGetStarted}
                            className="px-10 py-5 bg-white text-primary font-black rounded-2xl shadow-2xl hover:scale-105 transition-transform text-lg flex items-center gap-3"
                        >
                            Get Started Now <ArrowRight size={22} />
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-16 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-black text-xl">
                            <Layers className="text-primary w-6 h-6" /> Kron0
                        </div>
                        <p className="text-muted-foreground text-sm max-w-[200px]">Modern tools for modern students. Powered by high-fidelity design.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-white uppercase tracking-widest text-xs">Product</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Features</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Security</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-white uppercase tracking-widest text-xs">Company</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">About</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Contact</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-white uppercase tracking-widest text-xs">Legal</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>© 2026 KRON0 ARCHIVES</span>
                    <span>DESIGNED & ENGINEERED BY SAYAN</span>
                </div>
            </footer>
        </div>
    );
};

const BentoCard: React.FC<{ 
    className?: string, 
    icon: React.ReactNode, 
    title: string, 
    description: string,
    preview?: React.ReactNode
}> = ({ className, icon, title, description, preview }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass-premium p-8 rounded-[2rem] flex flex-col overflow-hidden relative group ${className}`}
        >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 scale-150 transition-all duration-500">
                {icon}
            </div>
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[90%]">{description}</p>
            {preview && <div className="flex-1 mt-auto">{preview}</div>}
        </motion.div>
    );
};
