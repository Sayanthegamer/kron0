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
    
    // FIX: Calibrated scroll transforms for maximum persistence
    const heroOpacity = useTransform(scrollY, [0, 1000], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 1000], [1, 0.95]);
    const mockupY = useTransform(scrollY, [0, 1200], [0, -150]);
    const mockupRotate = useTransform(scrollY, [0, 1200], [6, 0]);

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
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-800/60 bg-slate-950/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold shadow-sm">
                            K0
                        </div>
                        <span className="text-slate-100 font-bold text-xl">
                            Kron0
                        </span>
                    </motion.div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-primary transition-colors">Workflow</a>
                        <button 
                            onClick={onGetStarted}
                            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold shadow-sm"
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
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="w-full flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary mb-8 tracking-wider uppercase"
                        >
                            <Sparkles size={14} className="animate-pulse" /> Student Productivity Suite
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-7xl font-[900] tracking-tighter leading-[1.05] mb-8 max-w-5xl">
                            <span className="text-slate-100">
                                Master Your Semester
                            </span>
                            <br />
                            <span className="text-primary italic">without the Chaos</span>.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            The intelligent timetable, pomodoro focus tracker, and task dashboard designed specifically for college and university students.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onGetStarted}
                                className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 overflow-hidden text-base"
                            >
                                <span className="relative flex items-center gap-3">
                                    Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>
                            <button onClick={onGetStarted} className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-slate-200 transition-colors font-semibold">
                                <MousePointer2 size={18} /> Explore Features
                            </button>
                        </div>
                    </motion.div>

                    {/* CORRECTED: Product Preview Mockup with explicitly applied transforms */}
                    <motion.div 
                        style={{ y: mockupY, rotateX: mockupRotate }}
                        className="relative w-full max-w-5xl mt-12 mb-40 perspective-1000 transform-gpu"
                    >
                        <div className="glass-premium rounded-3xl p-1.5 md:p-3 shadow-[0_0_80px_rgba(139,47,201,0.25)] border-t border-white/20">
                            <div className="bg-[#0f0f15] rounded-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] flex flex-col border border-white/5 relative">
                                {/* Mock UI Header */}
                                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5 z-20">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                    <div className="ml-4 h-4 w-28 bg-white/10 rounded" />
                                </div>
                                {/* Mock UI Content */}
                                <div className="flex-1 flex p-4 md:p-8 gap-4 md:gap-8 overflow-hidden z-10">
                                    <div className="w-48 hidden lg:flex flex-col gap-4">
                                        <div className="h-32 bg-primary/20 rounded-xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 flex flex-col p-3 gap-2">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="h-2 w-full bg-white/10 rounded" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-6">
                                        <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="h-28 bg-white/5 rounded-xl border border-white/5 flex flex-col p-4 justify-between">
                                                <div className="w-1/2 h-4 bg-white/10 rounded" />
                                                <div className="w-full h-8 bg-primary/10 rounded" />
                                            </div>
                                            <div className="h-28 bg-secondary/15 rounded-xl border border-secondary/20 flex items-center justify-center">
                                                <div className="text-secondary font-bold text-2xl">45:00</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-[#020203] rounded-xl border border-white/5 relative overflow-hidden shadow-inner p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="w-24 h-4 bg-white/10 rounded" />
                                                <div className="flex gap-1">
                                                    {[1,2,3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary/40" />)}
                                                </div>
                                            </div>
                                            <div className="h-32 w-full bg-gradient-to-b from-primary/5 to-transparent rounded-lg border border-primary/5" />
                                        </div>
                                    </div>
                                </div>
                                {/* Label for Mockup */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="absolute -top-12 -right-6 md:-right-12 z-30 p-4 glass-premium rounded-2xl animate-floating flex flex-col items-center gap-1 shadow-2xl"
                                >
                                    <Zap className="text-yellow-400 w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Hyper-Sync</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Bento features Section */}
                <section id="features" className="max-w-7xl mx-auto mt-20">
                    <div className="text-center mb-24">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                        >
                            High-Fidelity Workflow.
                        </motion.h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-medium">Reclaim your focus with a suite designed for peak cognitive performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min md:auto-rows-[300px]">
                        {/* Large Card: Focus Engine */}
                        <BentoCard 
                            className="md:col-span-8 md:row-span-2"
                            icon={<Clock className="w-8 h-8 text-primary" />}
                            title="Visual Focus Engine"
                            description="Visual Pomodoro timers integrated directly with your task list. Track flow state duration and optimize your deep-work windows with automated session logging."
                            preview={
                                <div className="mt-8 flex items-end gap-3 h-48 overflow-hidden">
                                    <div className="w-full h-[60%] bg-primary/20 rounded-t-2xl border-t border-primary/20" />
                                    <div className="w-full h-[80%] bg-primary/40 rounded-t-2xl border-t border-primary/30" />
                                    <div className="w-full h-[100%] bg-primary rounded-t-2xl shadow-[0_0_40px_rgba(139,47,201,0.4)]" />
                                    <div className="w-full h-[70%] bg-primary/30 rounded-t-2xl border-t border-primary/20" />
                                </div>
                            }
                        />

                        {/* Mid Card: Calendar */}
                        <BentoCard 
                            className="md:col-span-4"
                            icon={<Calendar className="w-7 h-7 text-secondary" />}
                            title="Zero-friction Schedule"
                            description="Real-time class detection. Know exactly where you need to be, right now."
                        />

                        {/* Mid Card: Security */}
                        <BentoCard 
                            className="md:col-span-4" 
                            icon={<Shield className="w-7 h-7 text-green-400" />}
                            title="Private by Design"
                            description="End-to-end encryption for your academic schedule and focus data."
                        />

                        {/* Rect Card: Analytics */}
                        <BentoCard 
                            className="md:col-span-4 md:row-span-2"
                            icon={<BarChart3 className="w-8 h-8 text-secondary" />}
                            title="Deep Insights"
                            description="Know your data. Visualize peak focus hours and identify productivity killers before they impact your grades."
                            preview={
                                <div className="mt-8 flex flex-col gap-4">
                                    {[0.8, 0.4, 0.9].map((w, i) => (
                                        <div key={i} className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${w * 100}%` }}
                                                className="h-full bg-secondary shadow-[0_0_15px_rgba(0,217,249,0.5)]" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            }
                        />

                        {/* Wide Card: Quick Entry */}
                        <BentoCard 
                            className="md:col-span-8"
                            icon={<Zap className="w-7 h-7 text-yellow-500" />}
                            title="Lightning Rapid Entry"
                            description="Command-center inspired task entry. Keyboard-first interface designed for zero context-switching during focus."
                        />
                    </div>
                </section>

                {/* Final Call to Action */}
                <section className="max-w-5xl mx-auto mt-48 text-center py-24 rounded-[4rem] bg-primary relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                    <div className="relative z-10 flex flex-col items-center px-6">
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">Transcend the grind.</h2>
                        <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-xl font-medium">Join the elite cohort of students mastering their attention with Kron0. Absolutely free.</p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="px-12 py-6 bg-white text-primary font-black rounded-3xl shadow-2xl hover:shadow-white/20 transition-all text-xl flex items-center gap-4"
                        >
                            Get Started Now <ArrowRight size={24} />
                        </motion.button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-20 px-6 border-t border-white/5 bg-[#020203]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                            <Layers className="text-primary w-7 h-7" /> Kron0
                        </div>
                        <p className="text-muted-foreground text-base max-w-[280px] leading-relaxed">The high-fidelity terminal for academic excellence and cognitive focus.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 sm:gap-24 text-sm">
                        <div className="flex flex-col gap-5">
                            <span className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Product</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Focus Engine</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Architecture</a>
                        </div>
                        <div className="flex flex-col gap-5">
                            <span className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Company</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Identity</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy</a>
                        </div>
                        <div className="flex flex-col gap-5">
                            <span className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Legal</span>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Licensing</a>
                            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    <span>© 2026 KRON0 ARCHIVES — [BUILD V2.0.4]</span>
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        SYSTEMS STABLE
                    </span>
                    <span>ENGINEERED BY SAYAN</span>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className={`glass-premium p-8 rounded-[2.5rem] flex flex-col overflow-hidden relative group border border-white/5 ${className}`}
        >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 scale-[2.5] transition-all duration-700 pointer-events-none blur-sm">
                {icon}
            </div>
            <div className="mb-6 relative z-10 p-3 w-fit rounded-xl bg-white/5 border border-white/5 shadow-inner">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-white tracking-tighter relative z-10">{title}</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[92%] relative z-10">{description}</p>
            {preview && <div className="flex-1 mt-6 relative z-10">{preview}</div>}
        </motion.div>
    );
};
