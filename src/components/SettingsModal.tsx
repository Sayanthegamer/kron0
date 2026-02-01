import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2, Bell, Shield, Palette, User, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AnimatedModal, SettingsSection, ToggleSwitch, ColorPicker, ConfirmDialog } from './ui';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'confirming' | 'deleting' | 'success'>('idle');
    const [confirmPhrase, setConfirmPhrase] = useState('');
    const [error, setError] = useState('');

    // Mock settings state
    const [notifications, setNotifications] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [themeColor, setThemeColor] = useState('#8b5cf6');

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const REQUIRED_PHRASE = 'DELETE-MY-DATA';

    const handleResetData = async () => {
        if (!user) return;
        if (confirmPhrase !== REQUIRED_PHRASE) {
            setError('Incorrect confirmation phrase');
            return;
        }

        setStatus('deleting');
        setError('');

        try {
            const collections = ['entries', 'todos', 'focus_history'];

            for (const colName of collections) {
                const q = query(collection(db, colName), where('userId', '==', user.uid));
                const snapshot = await getDocs(q);

                snapshot.docs.forEach((document) => {
                    deleteDoc(doc(db, colName, document.id));
                });
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setConfirmPhrase('');
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error('Error resetting data:', err);
            setError('Failed to delete data. Please try again.');
            setStatus('idle');
        }
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            maxWidth="max-w-lg"
        >
            <div className="space-y-6">
                {/* Account Profile */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">{user?.displayName || 'User'}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="mt-1 flex gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">Pro Member</span>
                        </div>
                    </div>
                </div>

                {/* Notifications Settings */}
                <SettingsSection title="Notifications" icon={Bell} badge="New">
                    <ToggleSwitch 
                        label="Push Notifications" 
                        description="Receive alerts for upcoming classes"
                        enabled={notifications}
                        onChange={setNotifications}
                    />
                    <ToggleSwitch 
                        label="Sound Effects" 
                        description="Play sound when timer finishes"
                        enabled={soundEnabled}
                        onChange={setSoundEnabled}
                    />
                </SettingsSection>

                {/* Appearance Settings */}
                <SettingsSection title="Appearance" icon={Palette}>
                    <div className="space-y-4 pt-2">
                        <ColorPicker 
                            label="App Theme Color"
                            value={themeColor}
                            onChange={setThemeColor}
                        />
                    </div>
                </SettingsSection>

                {/* Danger Zone */}
                <SettingsSection title="Danger Zone" icon={AlertTriangle} destructive>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Permanently delete all your data including timetable entries, tasks, and history.
                        </p>

                        {status === 'success' ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-center font-bold"
                            >
                                Data Reset Successful!
                            </motion.div>
                        ) : status === 'idle' || status === 'confirming' ? (
                            <div className="space-y-4">
                                {status === 'idle' ? (
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setStatus('confirming')}
                                        className="w-full py-3 bg-destructive/10 text-destructive font-bold rounded-xl border border-destructive/20 hover:bg-destructive hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Reset All Data
                                    </motion.button>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3 p-4 rounded-xl bg-background border border-destructive/30 shadow-xl shadow-destructive/5"
                                    >
                                        <label className="block text-xs font-bold text-destructive uppercase tracking-tighter">
                                            Type <span className="font-mono bg-destructive/10 px-1.5 py-0.5 rounded text-sm">{REQUIRED_PHRASE}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={confirmPhrase}
                                            onChange={(e) => setConfirmPhrase(e.target.value)}
                                            placeholder={REQUIRED_PHRASE}
                                            className="w-full p-3 text-sm bg-muted/50 border border-destructive/20 rounded-lg text-destructive placeholder:text-destructive/30 focus:outline-none focus:ring-2 focus:ring-destructive/50 transition-all"
                                        />
                                        {error && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-500 font-bold"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setStatus('idle');
                                                    setConfirmPhrase('');
                                                }}
                                                className="flex-1 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setShowConfirmDialog(true)}
                                                disabled={confirmPhrase !== REQUIRED_PHRASE}
                                                className="flex-1 py-2 text-sm font-bold bg-destructive text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 shadow-lg shadow-destructive/20 transition-all"
                                            >
                                                Delete All
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-destructive">
                                <Loader2 className="w-10 h-10 animate-spin mb-3 opacity-50" />
                                <span className="font-bold text-sm animate-pulse">Wiping Cloud Data...</span>
                            </div>
                        )}
                    </div>
                </SettingsSection>

                {/* Footer Info */}
                <div className="pt-4 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
                        Version 2.0.4 • Made with ♥ for Students
                    </p>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleResetData}
                title="Are you absolutely sure?"
                message="This action will permanently delete all your timetable entries, todos, and focus history. This cannot be undone."
                confirmLabel="Yes, Delete Everything"
                isDestructive
            />
        </AnimatedModal>
    );
};
