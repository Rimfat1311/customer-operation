import React from 'react';
import { ChevronRight } from 'lucide-react';
import Badge from '../atoms/Badge';

/**
 * Ticket preview item in the inquiry inbox sidebar.
 * @param {object} question - Question/ticket data object
 * @param {boolean} isActive - Currently selected ticket
 * @param {Function} onClick - Click handler
 */
export default function TicketListItem({ question, isActive, onClick }) {
  const priorityVariant =
    question.priority === 'critical' ? 'rose' :
    question.priority === 'high' ? 'amber' : 'slate';

  const avatarBg =
    question.priority === 'critical' ? 'bg-rose-50 text-rose-600' :
    question.priority === 'high' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500';

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-all flex items-start space-x-3.5 hover:bg-slate-50 ${
        isActive ? 'bg-brand-primary-light/30 border-l-4 border-brand-primary' : ''
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${avatarBg}`}>
        {question.sender[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-700 truncate">{question.customer}</span>
          <span className="text-[10px] text-slate-400 font-light flex-shrink-0">{question.time}</span>
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mb-1">{question.subject}</h4>
        <p className="text-xs text-slate-400 font-light line-clamp-1">{question.body}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
            question.priority === 'critical' ? 'bg-rose-100 text-rose-800' :
            question.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-brand-secondary/15 text-slate-700'
          }`}>
            {question.priority}
          </span>
          <span className="text-[10px] text-slate-400 font-light">#{question.id}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 self-center flex-shrink-0" />
    </button>
  );
}
