import React from 'react';

/**
 * Icon + label + value row for customer contact or detail fields.
 * @param {React.ReactNode} icon - Leading icon element
 * @param {React.ReactNode} children - Content (label + value)
 * @param {string} className - Additional classes
 */
export default function CustomerInfoRow({ icon, children, className = '' }) {
  return (
    <div className={`flex items-start space-x-3 text-xs sm:text-sm text-slate-600 ${className}`}>
      <span className="text-slate-400 flex-shrink-0 mt-0.5">{icon}</span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}
