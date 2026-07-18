import { useState, useCallback } from 'react';

/**
 * Centralized toast notification hook.
 * Returns { toasts, showToast } where showToast(message, type) adds a toast
 * that auto-dismisses after the specified duration.
 */
export default function useToast(duration = 3000) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, [duration]);

  return { toasts, showToast };
}
