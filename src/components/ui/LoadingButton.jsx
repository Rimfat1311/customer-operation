import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * General-purpose button with loading spinner state.
 * @param {boolean} isLoading - Show spinner + loading text
 * @param {string} loadingText - Text to show when loading
 * @param {React.ReactNode} icon - Optional leading icon
 * @param {React.ReactNode} children - Button text content
 * @param {string} className - Additional classes
 * @param {string} variant - 'primary' | 'outline' | 'danger' (default: 'primary')
 */
const VARIANT_CLASSES = {
  primary: 'bg-brand-primary text-white font-semibold hover:bg-brand-primary-dark disabled:opacity-70 disabled:hover:bg-brand-primary',
  outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-75',
  danger: 'bg-brand-danger text-white font-semibold hover:bg-red-600',
};

export default function LoadingButton({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  icon, 
  children, 
  variant = 'primary',
  className = '', 
  ...rest 
}) {
  return (
    <button
      disabled={isLoading}
      className={`px-6 py-3 rounded-brand transition-all flex items-center justify-center space-x-2 text-sm ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
