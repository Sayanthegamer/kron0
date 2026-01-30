import { createContext } from 'react';
import type { FocusContextType } from '../../types';

export const FocusContext = createContext<FocusContextType | undefined>(undefined);
