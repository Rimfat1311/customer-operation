import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import InputField from '../atoms/InputField';
import RippleButton from '../atoms/RippleButton';

/**
 * Reset password request form step.
 * @param {string} email - Email value
 * @param {Function} onEmailChange - Email change handler
 * @param {string} emailError - Email validation error
 * @param {boolean} isLoading - Loading state
 * @param {Function} onSubmit - Form submit handler
 */
export default function ResetPasswordForm({ email, onEmailChange, emailError, isLoading, onSubmit }) {
  return (
    <div className="flex flex-col items-center">
      {/* Lock Graphic */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-brand bg-brand-primary/5 flex items-center justify-center text-brand-primary">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <div className="absolute w-20 h-20 border border-dashed border-brand-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
        <p className="text-slate-500 text-sm mt-2">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="w-full space-y-6">
        <InputField
          id="email"
          type="email"
          label="Email address"
          value={email}
          onChange={onEmailChange}
          icon={<Mail className="w-5 h-5" />}
          error={emailError}
          disabled={isLoading}
        />

        <RippleButton
          type="submit"
          isLoading={isLoading}
          loadingText="Sending Link..."
        >
          Send Reset Link
        </RippleButton>
      </form>

      <Link
        to="/"
        className="mt-6 flex items-center space-x-2 text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </Link>
    </div>
  );
}
