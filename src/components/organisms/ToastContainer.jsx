import React from 'react';
import Toast from '../atoms/Toast';

/**
 * Fixed-position container that renders the list of active toasts.
 * @param {Array} toasts - Array of { id, message, type } objects
 */
export default function ToastContainer({ toasts = [] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
}
