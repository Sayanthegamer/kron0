import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { logError } from '../lib/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, 'ErrorBoundary');
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        retry={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry?: () => void;
}

const ErrorFallbackContent: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="glass-card p-8 rounded-xl border border-border">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6">
            We're sorry for the inconvenience. The app encountered an unexpected error.
          </p>

          {import.meta.env.DEV && error && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer select-none">
                Error details (dev)
              </summary>
              <pre className="mt-3 p-3 rounded-lg bg-muted text-xs text-foreground whitespace-pre-wrap overflow-auto max-h-48">
                {error.stack || error.message}
              </pre>
            </details>
          )}

          <div className="flex gap-3 justify-center">
            {retry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retry}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => (
  <ErrorFallbackContent {...props} />
);

// Loading state component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-3 animate-spin-smooth" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

// Error state component
interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <AlertCircle className="w-12 h-12 text-destructive mb-3" />
      <p className="text-foreground text-sm text-center mb-4 max-w-sm">
        {error}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </div>
  );
};

// Retry operation component
interface RetryOperationProps {
  isRetrying: boolean;
  onRetry: () => void;
  className?: string;
}

export const RetryOperation: React.FC<RetryOperationProps> = ({ 
  isRetrying, 
  onRetry, 
  className = "" 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRetry}
      disabled={isRetrying}
      className={`flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-smooth text-sm ${isRetrying ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className={`flex items-center gap-2 ${isRetrying ? 'animate-spin-smooth' : ''}`}>
        <RefreshCw className="w-3 h-3" />
      </div>
      {isRetrying ? 'Retrying...' : 'Retry'}
    </motion.button>
  );
};