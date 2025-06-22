import React, { useEffect } from 'react';
import { IoWarningOutline, IoCloseOutline, IoRefreshOutline } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
  showRetry?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onDismiss,
  onRetry,
  autoHide = true,
  autoHideDelay = 5000,
  variant = 'error',
  className,
  showRetry = false
}) => {
  // Auto-hide functionality
  useEffect(() => {
    if (error && autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [error, autoHide, autoHideDelay, onDismiss]);

  if (!error) return null;

  const variants = {
    error: {
      container: 'bg-red-50 border-red-400',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'text-red-600 hover:text-red-700'
    },
    warning: {
      container: 'bg-amber-50 border-amber-400',
      icon: 'text-amber-400',
      title: 'text-amber-800',
      message: 'text-amber-700',
      button: 'text-amber-600 hover:text-amber-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-400',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'text-blue-600 hover:text-blue-700'
    }
  };

  const style = variants[variant];

  const titles = {
    error: 'Error Loading Data',
    warning: 'Warning',
    info: 'Information'
  };

  return (
    <div 
      className={cn(
        `${style.container} border-l-4 p-4 rounded-lg animate-fade-in`,
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <IoWarningOutline className={`w-5 h-5 ${style.icon} mr-3 mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${style.title} mb-1`}>
            {titles[variant]}
          </h3>
          <div className={`text-sm ${style.message}`}>
            <p className="break-words">{error}</p>
          </div>
          
          {/* Action buttons */}
          <div className="mt-3 flex items-center space-x-4">
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
                className={`text-sm ${style.button} underline hover:no-underline flex items-center space-x-1 transition-colors`}
              >
                <IoRefreshOutline className="w-4 h-4" />
                <span>Retry</span>
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`text-sm ${style.button} underline hover:no-underline transition-colors`}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        
        {/* Close button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 flex-shrink-0 ${style.icon} hover:opacity-70 transition-opacity`}
            aria-label="Close alert"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Progress bar for auto-hide */}
      {autoHide && autoHideDelay && (
        <div className="mt-3 w-full bg-white/30 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-1 ${variant === 'error' ? 'bg-red-400' : variant === 'warning' ? 'bg-amber-400' : 'bg-blue-400'} transition-all ease-linear`}
            style={{
              width: '100%',
              animation: `shrink ${autoHideDelay}ms linear forwards`
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Success alert variant
export const SuccessAlert: React.FC<{
  message: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
}> = ({ message, onDismiss, autoHide = true, autoHideDelay = 3000, className }) => {
  useEffect(() => {
    if (message && autoHide && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [message, autoHide, autoHideDelay, onDismiss]);

  if (!message) return null;

  return (
    <div 
      className={cn(
        'bg-green-50 border-green-400 border-l-4 p-4 rounded-lg animate-fade-in',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <svg 
          className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-green-800 mb-1">
            Success
          </h3>
          <div className="text-sm text-green-700">
            <p className="break-words">{message}</p>
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-green-400 hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            <IoCloseOutline className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert; 