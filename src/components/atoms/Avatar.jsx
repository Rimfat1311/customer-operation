import React from 'react';

/**
 * Circular avatar displaying initials with configurable background color.
 * @param {string} initials - Character(s) to display
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} bgClass - Tailwind bg class (default: 'bg-brand-primary')
 * @param {string} textClass - Tailwind text class (default: 'text-white')
 * @param {string} className - Additional classes
 */
export default function Avatar({ 
  initials = '?', 
  size = 'md', 
  bgClass = 'bg-brand-primary', 
  textClass = 'text-white', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-sm'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgClass} ${textClass} flex items-center justify-center font-bold flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}
