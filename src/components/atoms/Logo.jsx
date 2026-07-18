import React from 'react';

/**
 * LAP Contact Center logo with checkmark icon and optional text.
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} showText - Show the "LAP Contact Center" text (default: true)
 * @param {string} textClass - Text color class (default: 'text-slate-800')
 * @param {string} bgClass - Icon background class (default: 'bg-brand-primary')
 * @param {string} className - Additional wrapper classes
 */
export default function Logo({ 
  size = 'md', 
  showText = true, 
  textClass = 'text-slate-800',
  bgClass = 'bg-brand-primary',
  className = '' 
}) {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-base sm:text-lg' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-xl' },
    lg: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-xl' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${s.box} rounded-brand ${bgClass} flex items-center justify-center shadow-inner`}>
        <svg viewBox="0 0 32 32" className={`${s.icon} fill-white`} xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${s.text} ${textClass} tracking-tight`}>LAP Contact Center</span>
      )}
    </div>
  );
}
