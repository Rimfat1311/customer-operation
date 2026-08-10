import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable floating-label input with leading icon, error state, and optional password toggle.
 * @param {string} id - Input id and htmlFor
 * @param {string} type - Input type (default: 'text')
 * @param {string} label - Floating label text
 * @param {string} value - Controlled value
 * @param {Function} onChange - Change handler
 * @param {React.ReactNode} icon - Leading icon element
 * @param {string} error - Error message (empty = no error)
 * @param {boolean} disabled - Disabled state
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 * @param {boolean} passwordVisible - Password visibility state
 * @param {Function} onTogglePassword - Toggle password visibility handler
 * @param {object} inputProps - Additional props for the input element
 */
export default function InputField({
  id,
  type = 'text',
  label,
  value,
  onChange,
  icon,
  error = '',
  disabled = false,
  showPasswordToggle = false,
  passwordVisible = false,
  onTogglePassword,
  ...inputProps
}) {
  const actualType = showPasswordToggle ? (passwordVisible ? 'text' : 'password') : type;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={actualType}
        id={id}
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${showPasswordToggle ? 'pr-11' : 'pr-4'} py-3 bg-slate-50 border rounded-brand text-slate-800 text-sm focus:bg-white focus:outline-none transition-all duration-200 float-label-input ${
          error
            ? 'border-brand-danger focus:border-brand-danger focus:ring-1 focus:ring-brand-danger'
            : 'border-slate-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
        }`}
        placeholder=" "
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...inputProps}
      />
      <label htmlFor={id} className={`absolute left-1 text-slate-400 text-sm transition-all pointer-events-none float-label`}>
        {label}
      </label>

      {showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          onClick={onTogglePassword}
          disabled={disabled}
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
        >
          {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}

      {error && (
        <p className="text-brand-danger text-xs mt-1.5 flex items-center" role="alert">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-danger mr-1.5 inline-block"></span>
          {error}
        </p>
      )}
    </div>
  );
}
