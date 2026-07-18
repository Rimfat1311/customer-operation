import React from 'react';

/**
 * Single toast notification pill with colored status dot.
 * @param {string} message - Toast message text
 * @param {string} type - 'success' | 'error' | 'info' (controls dot color)
 */
export default function Toast({ message, type = 'info' }) {
  const dotColor =
    type === 'success' ? 'bg-brand-success' :
    type === 'error' ? 'bg-brand-danger' : 'bg-brand-primary';

  return (
    <div className="pointer-events-auto bg-slate-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2.5 animate-slide-up">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>{message}</span>
    </div>
  );
}
