import React from 'react';

/**
 * Small icon-only button with hover state and accessibility label.
 * @param {Function} onClick - Click handler
 * @param {React.ReactNode} icon - Icon element to render
 * @param {string} label - Aria label for accessibility
 * @param {string} className - Additional classes
 */
export default function IconButton({ onClick, icon, label, className = '', ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors ${className}`}
      aria-label={label}
      {...rest}
    >
      {icon}
    </button>
  );
}
