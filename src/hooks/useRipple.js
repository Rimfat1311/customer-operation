import { useState, useCallback } from 'react';

/**
 * Ripple animation hook for button click effects.
 * Returns { ripples, handleRipple } for use with the RippleButton component.
 */
export default function useRipple(duration = 600) {
  const [ripples, setRipples] = useState([]);

  const handleRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const clientX = e.clientX || (rect.left + rect.width / 2);
    const clientY = e.clientY || (rect.top + rect.height / 2);
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      style: { width: size, height: size, left: x, top: y }
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, duration);
  }, [duration]);

  return { ripples, handleRipple };
}
