import React, { useState } from 'react';
import { MessageSquare, User, AlertCircle, Clock, Check, Send, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const INITIAL_QUESTIONS = [
  {
    id: 'Q-9812',
    customer: 'Acme Corporation Ltd',
    sender: 'Sarah Jenkins',
    subject: 'Delayed shipment of product batch B-402',
    body: 'Hello Support, we ordered 150 units of the smart controller hub under SAP Sold To ID 470011. The delivery was scheduled for yesterday, but the carrier tracker is showing no updates since it departed the hub. Can you please check on this?',
    time: '12 mins ago',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'Q-9809',
    customer: 'Global Tech Solutions',
    sender: 'David Chen',
    subject: 'API integration endpoint error (500 Internal Server)',
    body: 'When trying to sync our inventory records through the customer webhook endpoint, we are consistently receiving a 500 error response. The payload matches the schema in the dev portal. Is there an active incident?',
    time: '45 mins ago',
    priority: 'critical',
    status: 'pending'
  },
  {
    id: 'Q-9788',
    customer: 'Summit Retailers',
    sender: 'Emma Rodriguez',
    subject: 'Credit hold inquiry',
    body: 'We noticed our portal accounts are marked suspended. We processed the outstanding payment of $98,750 on Friday afternoon. Could you please review and remove the hold on our account?',
    time: '2 hours ago',
    priority: 'medium',
    status: 'pending'
  }
];

export default function TakeQuestionsPage() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [activeQuestionId, setActiveQuestionId] = useState(INITIAL_QUESTIONS[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeQuestionId) return;

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      showToast(`Response submitted for Ticket ${activeQuestionId}!`);
      
      // Update question status to completed or answered
      setQuestions(prev => prev.filter(q => q.id !== activeQuestionId));
      
      // Reset state
      setReplyText('');
      setIsSubmitting(false);

      // Select another question if available
      const remaining = questions.filter(q => q.id !== activeQuestionId);
      if (remaining.length > 0) {
        setActiveQuestionId(remaining[0].id);
      } else {
        setActiveQuestionId(null);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-slide-up relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2.5 z-50 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-brand-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Take Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Answer incoming support tickets and client inquiries in real time.</p>
        </div>
        <div className="bg-brand-primary-light text-brand-primary text-xs px-3 py-1 rounded-full font-bold">
          {questions.length} Active Tickets
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ticket List */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-brand shadow-sm divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry Inbox</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionId(q.id);
                    setReplyText('');
                  }}
                  className={`w-full p-4 text-left transition-all flex items-start space-x-3.5 hover:bg-slate-50 ${
                    activeQuestionId === q.id ? 'bg-brand-primary-light/30 border-l-4 border-brand-primary' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    q.priority === 'critical' ? 'bg-rose-50 text-rose-600' :
                    q.priority === 'high' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {q.sender[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate">{q.customer}</span>
                      <span className="text-[10px] text-slate-400 font-light flex-shrink-0">{q.time}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mb-1">{q.subject}</h4>
                    <p className="text-xs text-slate-400 font-light line-clamp-1">{q.body}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        q.priority === 'critical' ? 'bg-rose-100 text-rose-800' :
                        q.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-brand-secondary/15 text-slate-700'
                      }`}>
                        {q.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-light">#{q.id}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 self-center flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Response Panel */}
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
                <form onSubmit={handleReplySubmit} className="space-y-4 pt-2">
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
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-brand text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-light"
                    />
                  </div>
                  <div className="flex justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setReplyText('')}
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
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-brand p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Queue Clean!</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-1">
            All customer questions have been answered. Outstanding job keeping our response times low!
          </p>
        </div>
      )}
    </div>
  );
}
