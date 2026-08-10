import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Success confirmation screen after password reset request.
 * @param {string} email - The email address the reset was sent to
 * @param {boolean} isLoading - Loading state for resend
 * @param {Function} onResend - Resend email handler
 */
export default function ResetPasswordSuccess({ email, isLoading, onResend }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      {/* Success checkmark animation */}
      <div className="w-16 h-16 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success mb-6 relative">
        <svg className="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="absolute inset-0 rounded-full border-4 border-brand-success/30 animate-ping opacity-75" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
      <p className="text-slate-500 text-sm max-w-sm mb-2">
        We've sent a password reset link to:
      </p>
      <p className="font-semibold text-slate-800 text-sm mb-6 break-all">
        {email}
      </p>

      <p className="text-slate-400 text-xs max-w-xs mb-6">
        Didn't receive the email? Check your spam folder, or click the button below to resend.
      </p>

      {/* Actions */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={onResend}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-brand text-sm font-medium transition-all active:translate-y-[1px] disabled:opacity-75"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Resend Email</span>
        </button>

        <Link
          to="/"
          className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-brand text-sm font-medium transition-all active:translate-y-[1px]"
        >
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
}
