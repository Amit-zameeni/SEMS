'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Using a mock toast system since we didn't add it to store for simplicity,
// but we will expose a window level event to trigger them.
export const toast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
  window.dispatchEvent(new CustomEvent('sems-toast', { detail: { message, type } }));
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: string }[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message: e.detail.message, type: e.detail.type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };
    window.addEventListener('sems-toast', handler);
    return () => window.removeEventListener('sems-toast', handler);
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            key={t.id}
            style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', fontWeight: 500, fontSize: 13, pointerEvents: 'auto'
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: t.type === 'error' ? 'var(--red-critical)' :
                          t.type === 'success' ? 'var(--green-safe)' :
                          t.type === 'warn' ? 'var(--amber-warn)' : 'var(--blue-accent)'
            }} />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
