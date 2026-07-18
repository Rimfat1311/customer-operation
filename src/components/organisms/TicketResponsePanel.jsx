import React from 'react';
import { Send, Clock, HelpCircle } from 'lucide-react';

/**
 * Ticket detail view with reply textarea and send button.
 * @param {object} activeQuestion - Currently selected question object (or null)
 * @param {string} replyText - Reply textarea value
 * @param {Function} onReplyChange - Reply text change handler
 * @param {boolean} isSubmitting - Submission loading state
 * @param {Function} onSubmit - Form submit handler
 * @param {Function} onClear - Clear reply text handler
 */
export default function TicketResponsePanel({ 
  activeQuestion, 
  replyText, 
  onReplyChange, 
  isSubmitting, 
  onSubmit, 
  onClear 
}) {
  return (
    <div className="lg:col-span-7 bg-white border border-slate-100 rounded-brand shadow-sm p-6 space-y-5">
      {activeQuestion ? (
        <div className="space-y-5">
          {/* Header info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {activeQuestion.sender[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">{activeQuestion.sender}</h3>
                <p className="text-[11px] text-slate-400 font-light">{activeQuestion.customer} · {activeQuestion.time}</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
              {activeQuestion.id}
            </span>
          </div>

          {/* Question Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiry Subject</h4>
            <p className="text-sm font-bold text-slate-800">{activeQuestion.subject}</p>
            <div className="bg-slate-50 rounded-brand p-4 border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
                {activeQuestion.body}
              </p>
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="reply" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Agent Response
              </label>
              <textarea
                id="reply"
                rows={5}
                required
                placeholder="Type your official support response here..."
                value={replyText}
                onChange={onReplyChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-brand text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-light"
              />
            </div>
            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={onClear}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-brand transition-all"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="px-5 py-2.5 bg-brand-primary text-white font-semibold rounded-brand hover:bg-brand-primary-dark transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:hover:bg-brand-primary"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Sending Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Select a Ticket</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xs mt-1">
            Choose an active inquiry from the sidebar inbox to view details and send your reply.
          </p>
        </div>
      )}
    </div>
  );
}
