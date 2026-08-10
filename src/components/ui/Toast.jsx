import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Premium Modern Toast Notification component.
 * @param {string} message - Toast message text
 * @param {string} title - Optional title
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {Function} onClose - Optional close callback
 */
export default function Toast({ message, title, type = 'info', onClose }) {
  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className={`pointer-events-auto max-w-md w-full rounded-2xl shadow-2xl border p-4 flex items-start gap-3.5 backdrop-blur-xl transition-all duration-300 animate-slide-up ${
      isSuccess
        ? 'bg-slate-900/95 text-white border-emerald-500/30 shadow-emerald-950/20'
        : isError
        ? 'bg-slate-900/95 text-white border-rose-500/30 shadow-rose-950/20'
        : 'bg-slate-900/95 text-white border-slate-700/40 shadow-slate-950/20'
    }`}>
      {/* Status Icon Badge */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
        isSuccess
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : isError
          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
          : 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5" />}
        {isError && <AlertTriangle className="w-5 h-5" />}
        {!isSuccess && !isError && <Info className="w-5 h-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {title || (isSuccess ? 'Broadcast Successful' : isError ? 'Broadcast Failure' : 'Notification')}
        </h4>
        <p className="text-sm font-medium text-slate-100 mt-0.5 leading-snug">
          {message}
        </p>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
