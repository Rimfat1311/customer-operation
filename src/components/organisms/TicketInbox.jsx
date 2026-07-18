import React from 'react';
import TicketListItem from '../molecules/TicketListItem';

/**
 * Ticket list panel with "Inquiry Inbox" header and scrollable ticket items.
 * @param {Array} questions - Array of question/ticket objects
 * @param {string} activeQuestionId - Currently selected ticket ID
 * @param {Function} onSelectQuestion - Handler when a ticket is clicked
 */
export default function TicketInbox({ questions, activeQuestionId, onSelectQuestion }) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-100 rounded-brand shadow-sm divide-y divide-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry Inbox</span>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {questions.map((q) => (
          <TicketListItem
            key={q.id}
            question={q}
            isActive={activeQuestionId === q.id}
            onClick={() => onSelectQuestion(q.id)}
          />
        ))}
      </div>
    </div>
  );
}
