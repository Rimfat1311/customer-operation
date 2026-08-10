import React from 'react';

/**
 * Configurable status/priority/tier badge with predefined color variants.
 * @param {string} variant - 'primary' | 'success' | 'danger' | 'warning' | 'purple' | 'emerald' | 'rose' | 'amber' | 'slate'
 * @param {string} children - Badge text content
 * @param {React.ReactNode} icon - Optional leading icon
 * @param {string} className - Additional classes
 */
const VARIANT_CLASSES = {
  primary: 'bg-brand-primary-light text-brand-primary',
  success: 'bg-emerald-50 text-emerald-700',
  danger: 'bg-rose-50 text-rose-700',
  warning: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  emerald: 'bg-emerald-100 text-emerald-800',
  rose: 'bg-rose-100 text-rose-800',
  amber: 'bg-amber-100 text-amber-800',
  slate: 'bg-brand-secondary/15 text-slate-700',
};

export default function Badge({ variant = 'primary', children, icon, className = '' }) {
  return (
    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
