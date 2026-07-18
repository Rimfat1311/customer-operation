import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      style: {
        width: size,
        height: size,
        left: x,
        top: y,
      }
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const validateForm = () => {
    if (!email) {
      setEmailError('Email address is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleRipple(e);

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      await authService.requestPasswordReset(email);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || 'Failed to send reset link. Please try again.');
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setToastMessage('');
    setApiError('');

    try {
      await authService.resendPasswordReset(email);
      setIsLoading(false);
      setToastMessage('Reset link resent successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setIsLoading(false);
      setApiError(err.message || 'Failed to resend link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 z-50 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-brand-success"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background Graphic Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full filter blur-3xl" />

      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-brand shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-up relative z-10">

        {/* Step 1: Request Reset Form */}
        {!isSuccess ? (
          <div className="flex flex-col items-center">
            {/* Lock Graphic */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-brand bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                {/* Custom Lock SVG with Glow */}
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

            {apiError && (
              <div className="w-full mb-6 p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl flex items-start space-x-3 text-brand-danger animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-left">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Email Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-brand text-slate-800 text-sm focus:bg-white focus:outline-none transition-all duration-200 float-label-input ${emailError
                    ? 'border-brand-danger focus:border-brand-danger focus:ring-1 focus:ring-brand-danger'
                    : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    }`}
                  placeholder=" "
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  disabled={isLoading}
                />
                <label htmlFor="email" className="absolute left-1 text-slate-400 text-sm transition-all pointer-events-none float-label">
                  Email address
                </label>
                {emailError && (
                  <p className="text-brand-danger text-xs mt-1.5 flex items-center" role="alert">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-danger mr-1.5 inline-block"></span>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Primary Send Button */}
              <button
                type="submit"
                onClick={handleRipple}
                disabled={isLoading}
                className="w-full relative py-3 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-brand font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 flex items-center justify-center shadow-sm active:translate-y-[1px] disabled:opacity-75 disabled:pointer-events-none ripple-btn"
              >
                {ripples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="ripple-span"
                    style={ripple.style}
                  />
                ))}

                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 flex items-center space-x-2 text-xs sm:text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          /* Step 2: Success Screen */
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

            {apiError && (
              <div className="w-full mb-6 p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl flex items-start space-x-3 text-brand-danger animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-left">{apiError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={handleResend}
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
        )}

      </div>
    </div>
  );
}
