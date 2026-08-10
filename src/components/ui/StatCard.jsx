import React from 'react';

/**
 * Dashboard metric card with label, large value, trend badge, and sub-label.
 * @param {string} label - Metric name
 * @param {string|number} value - Primary metric value
 * @param {string} subLabel - Smaller contextual text
 * @param {React.ReactNode} badge - Optional trend/alert badge element
 */
export default function StatCard({ label, value, subLabel, badge }) {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        {badge}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subLabel && (
        <p className="text-[10px] text-slate-400 mt-1">{subLabel}</p>
      )}
    </div>
  );
}
