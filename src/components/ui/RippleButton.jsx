import React from 'react';
import { Loader2 } from 'lucide-react';
import useRipple from '@/hooks/useRipple';

/**
 * Primary CTA button with ripple animation effect.
 * @param {boolean} isLoading - Show spinner state
 * @param {string} loadingText - Text during loading
 * @param {React.ReactNode} children - Button text
 * @param {string} className - Additional classes
 */
export default function RippleButton({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  children, 
  className = '', 
  onClick,
  ...rest 
}) {
  const { ripples, handleRipple } = useRipple();

  const handleClick = (e) => {
    handleRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full relative py-3 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-brand font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 flex items-center justify-center shadow-sm active:translate-y-[1px] disabled:opacity-75 disabled:pointer-events-none ripple-btn ${className}`}
      {...rest}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-span"
          style={ripple.style}
        />
      ))}

      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>{loadingText}</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
