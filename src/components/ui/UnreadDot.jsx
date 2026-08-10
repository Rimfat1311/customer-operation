import React from 'react';

/**
 * Tiny colored circle dot used as an unread indicator.
 * @param {boolean} visible - Whether to show the dot
 * @param {string} color - Tailwind bg color class (default: 'bg-brand-primary')
 * @param {string} className - Additional classes
 */
export default function UnreadDot({ visible = true, color = 'bg-brand-primary', className = '' }) {
  if (!visible) return <div className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />;
  
  return (
    <div className={`w-1.5 h-1.5 rounded-full ${color} flex-shrink-0 ${className}`} />
  );
}
