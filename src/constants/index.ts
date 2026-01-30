import type { TimerMode, ModeConfig } from '../types';

export const MODES: Record<TimerMode, ModeConfig> = {
    focus: { label: 'Focus', minutes: 25, color: 'text-primary' },
    short: { label: 'Short Break', minutes: 5, color: 'text-teal-500' },
    long: { label: 'Long Break', minutes: 15, color: 'text-indigo-500' },
    custom: { label: 'Custom', minutes: 25, color: 'text-pink-500' }
};
