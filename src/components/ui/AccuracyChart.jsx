import React from 'react';

/**
 * Circular SVG accuracy score indicator with breakdown.
 * @param {number} score - Overall accuracy percentage (0-100)
 * @param {Array} breakdown - Array of { label, score, color } for the legend
 */
export default function AccuracyChart({ score = 84, breakdown = [] }) {
  // Calculate stroke dash offset for score percentage
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (score / 100) * circumference;

  const defaultBreakdown = [
    { label: 'GDPR', score: 92, color: 'bg-brand-success' },
    { label: 'SAP', score: 84, color: 'bg-brand-primary' },
    { label: 'Listening', score: 76, color: 'bg-brand-secondary' },
  ];

  const items = breakdown.length > 0 ? breakdown : defaultBreakdown;

  return (
    <div className="bg-white border border-slate-100 rounded-brand p-5 flex flex-col items-center shadow-sm">
      <div className="flex justify-between items-center w-full mb-4">
        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Average Accuracy Score</h4>
        <span className="text-[10px] px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full font-bold">Overall</span>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke="#DC0A12" 
            strokeWidth="8" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-extrabold text-slate-800">{score}</span>
          <span className="text-sm font-semibold text-slate-500">%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-5 text-center text-[10px]">
        {items.map((item) => (
          <div key={item.label}>
            <span className={`w-2 h-2 rounded-full ${item.color} inline-block mr-1`} />
            <span className="block font-bold text-slate-700">{item.score}%</span>
            <span className="text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
