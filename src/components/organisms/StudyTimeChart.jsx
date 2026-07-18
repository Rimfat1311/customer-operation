import React from 'react';

/**
 * Bar chart for weekly study hours.
 */
const STUDY_DATA = [
  { day: 'M', hours: 2, height: '40px' },
  { day: 'T', hours: 4, height: '70px' },
  { day: 'W', hours: 3, height: '55px' },
  { day: 'T', hours: 5, height: '90px', isToday: true },
  { day: 'F', hours: 3.5, height: '65px' },
  { day: 'S', hours: 1.5, height: '30px' },
  { day: 'S', hours: 1, height: '20px' },
];

export default function StudyTimeChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-brand p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Study Time Log</h4>
        <span className="text-[10px] text-slate-400 font-light">Last 7 Days</span>
      </div>

      <div className="flex justify-between items-end h-28 pt-2">
        {STUDY_DATA.map((item, i) => (
          <div key={i} className="flex flex-col items-center space-y-1 w-full">
            <div 
              className={`w-2.5 ${item.isToday ? 'bg-brand-primary hover:bg-brand-primary-dark' : 'bg-brand-primary/20 hover:bg-brand-primary'} rounded-t transition-all cursor-pointer`}
              style={{ height: item.height }}
              title={`${item.day === 'M' ? 'Monday' : item.day === 'W' ? 'Wednesday' : item.day === 'F' ? 'Friday' : item.day}: ${item.hours} hours`}
            />
            <span className={`text-[9px] font-semibold ${item.isToday ? 'text-brand-primary font-bold' : 'text-slate-400'}`}>{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>24 Study Hours This Week</span>
        <span className="text-brand-success font-semibold flex items-center">
          +15% vs last week
        </span>
      </div>
    </div>
  );
}
