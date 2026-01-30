import { createContext } from 'react';
import type { TimetableContextType } from '../../types/timetable';

export const TimetableContext = createContext<TimetableContextType | undefined>(undefined);
