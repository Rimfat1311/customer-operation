import React from 'react';

/**
 * Reusable page header with title, subtitle, and optional right-side actions.
 * @param {string} title - Page title
 * @param {string} subtitle - Subtitle/description text
 * @param {React.ReactNode} actions - Optional right-side action elements
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
