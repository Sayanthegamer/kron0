import { useContext } from 'react';
import { FocusContext } from '../context/definitions/FocusContextDefinition';

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (!context) throw new Error('useFocus must be used within a FocusProvider');
    return context;
};
