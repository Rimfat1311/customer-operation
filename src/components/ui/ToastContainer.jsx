import React from 'react';
import Toast from './Toast';

/**
 * Fixed-position container that renders the list of active toasts.
 * @param {Array} toasts - Array of { id, message, type, title } objects
 * @param {Function} onDismiss - Optional callback to dismiss a toast by ID
 */
export default function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-3 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          onClose={onDismiss ? () => onDismiss(toast.id) : undefined}
        />
      ))}
    </div>
  );
}
