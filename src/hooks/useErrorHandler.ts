import { useCallback } from 'react';
import { useToast } from './useToast';
import { logError } from '../lib/errors';

export const useErrorHandler = () => {
  const { showError } = useToast();

  return useCallback((error: unknown, context?: string) => {
    logError(error, context);
    showError('Error', 'Something went wrong. Please try again.');
  }, [showError]);
};
