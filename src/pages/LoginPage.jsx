import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, Users, Loader2 } from 'lucide-react';

export default function LoginPage() {
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
  const [ripples, setRipples] = useState([]);

  // Handles custom ripple animation
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

  // Input Validation
  const validateForm = () => {
    let isValid = true;
    
    // Email Check
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password Check
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
    handleRipple(e);

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (_provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 animate-fade-in font-sans">
      
      {/* Left Column: Welcome & Gradient Artwork */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-brand-primary to-brand-secondary text-white relative overflow-hidden p-12 flex-col justify-between">
        
        {/* Soft Background Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-brand bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">LAP Contact Center</span>
        </div>

        {/* Core Welcoming Messages */}
        <div className="my-auto max-w-lg z-10 animate-slide-up">
          <h1 className="text-4xl font-extrabold leading-tight mb-4 text-white">
            Welcome to your workspace.
          </h1>
          <p className="text-white/80 text-lg font-light leading-relaxed">
            Everything you need to manage your projects, collaborate with your team, and track your daily tasks — all in one beautiful place.
          </p>
        </div>

        {/* Abstract Dynamic Illustration / Floating UI Cards */}
        <div className="relative h-60 w-full z-10 select-none">
          {/* Main Backdrop Glowing Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full filter blur-2xl animate-pulse" />
          
          {/* Floating Card A */}
          <div className="absolute top-4 left-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-brand shadow-lg flex items-center space-x-3 w-56 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs text-white/60">Tasks Completed</span>
              <span className="block font-semibold text-sm">128 this week</span>
            </div>
          </div>

          {/* Floating Card B */}
          <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-brand shadow-lg flex items-center space-x-3 w-56 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs text-white/60">Team Collaboration</span>
              <span className="block font-semibold text-sm">24 active members</span>
            </div>
          </div>

          {/* Floating Card C */}
          <div className="absolute top-28 left-48 bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] border border-white">T</div>
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] border border-white">M</div>
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] border border-white">S</div>
            </div>
            <span className="text-[11px] font-medium text-white/95">+12 online</span>
          </div>
        </div>

        {/* Footer Carousel Dots Indicator */}
        <div className="flex space-x-2 z-10">
          <span className="w-6 h-1.5 rounded-full bg-white opacity-100 transition-all duration-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer" />
        </div>
      </div>

      {/* Right Column: Card-style Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:w-1/2">
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-brand shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-up">
          
          {/* Mobile Brand Logo */}
          <div className="flex md:hidden items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-brand bg-brand-primary flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L13 21L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">LAP Contact Center</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field with Floating Label & Inline Validation */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                id="email"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-brand text-slate-800 text-sm focus:bg-white focus:outline-none transition-all duration-200 float-label-input ${
                  emailError 
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

            {/* Password Field with Show/Hide Toggle & Inline Validation */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-brand text-slate-800 text-sm focus:bg-white focus:outline-none transition-all duration-200 float-label-input ${
                  passwordError 
                    ? 'border-brand-danger focus:border-brand-danger focus:ring-1 focus:ring-brand-danger' 
                    : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                }`}
                placeholder=" "
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                disabled={isLoading}
              />
              <label htmlFor="password" className="absolute left-1 text-slate-400 text-sm transition-all pointer-events-none float-label">
                Password
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {passwordError && (
                <p className="text-brand-danger text-xs mt-1.5 flex items-center" role="alert">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-danger mr-1.5 inline-block"></span>
                  {passwordError}
                </p>
              )}
            </div>

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
            <button
              type="submit"
              onClick={handleRipple}
              disabled={isLoading}
              className="w-full relative py-3 bg-brand-primary hover:bg-blue-700 text-white rounded-brand font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 flex items-center justify-center shadow-sm active:translate-y-[1px] disabled:opacity-75 disabled:pointer-events-none ripple-btn"
            >
              {/* Ripple Effect Spans */}
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
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-6">
              <div className="w-full border-t border-slate-100"></div>
              <span className="px-3 text-xs text-slate-400 bg-white whitespace-nowrap">or continue with</span>
              <div className="w-full border-t border-slate-100"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 hover:bg-slate-55 hover:border-slate-300 text-slate-700 rounded-brand text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-100 active:translate-y-[1px] disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 hover:bg-slate-55 hover:border-slate-300 text-slate-700 rounded-brand text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-100 active:translate-y-[1px] disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
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

    </div>
  );
}
