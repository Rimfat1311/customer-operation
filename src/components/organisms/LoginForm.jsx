import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import InputField from '../atoms/InputField';
import RippleButton from '../atoms/RippleButton';
import Logo from '../atoms/Logo';
import SocialLoginButton from '../molecules/SocialLoginButton';

/**
 * Right-side login card with email/password form, social logins, and validation.
 */
export default function LoginForm() {
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and UI states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:w-1/2">
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-brand shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-up">
        
        {/* Mobile Brand Logo */}
        <div className="flex md:hidden items-center space-x-2 mb-6">
          <Logo size="sm" textClass="text-slate-800" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to continue to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <InputField
            id="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            icon={<Mail className="w-5 h-5" />}
            error={emailError}
            disabled={isLoading}
          />

          {/* Password Field */}
          <InputField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            icon={<Lock className="w-5 h-5" />}
            error={passwordError}
            disabled={isLoading}
            showPasswordToggle
            passwordVisible={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none group text-slate-600">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="w-4 h-4 border border-slate-300 rounded bg-white peer-checked:bg-brand-primary peer-checked:border-brand-primary flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-brand-primary/20">
                <svg className="w-2.5 h-2.5 text-white fill-none stroke-current" strokeWidth="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="group-hover:text-slate-800 transition-colors">Remember me</span>
            </label>
            
            <Link 
              to="/reset-password" 
              className="text-brand-primary font-medium hover:text-brand-secondary transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Primary Sign In Button */}
          <RippleButton
            type="submit"
            isLoading={isLoading}
            loadingText="Signing In..."
          >
            Sign In
          </RippleButton>

          {/* Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-100"></div>
            <span className="px-3 text-xs text-slate-400 bg-white whitespace-nowrap">or continue with</span>
            <div className="w-full border-t border-slate-100"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <SocialLoginButton
              provider="Google"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="GitHub"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
            />
          </div>

          {/* Footer Prompt */}
          <p className="text-center text-xs text-slate-500 mt-8">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-primary font-semibold hover:underline">
              Create one free
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
