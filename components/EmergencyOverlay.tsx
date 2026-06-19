'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSemsStore } from '@/lib/store';

export default function EmergencyOverlay() {
  const { emergencyType, emergencySeverity, emergencyStartTime, deactivateEmergency } = useSemsStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!emergencyStartTime) return;
    const t = setInterval(() => {
      setElapsed(Math.floor((new Date().getTime() - emergencyStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [emergencyStartTime]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 100,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: 32,
      }}
    >
      {/* Red vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, rgba(239,68,68,0.1) 100%)',
        boxShadow: 'inset 0 0 100px rgba(239,68,68,0.2)',
        zIndex: 0, pointerEvents: 'none'
      }} className="emergency-mode" />

      {/* Top Warning Banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          display: 'flex', justifyContent: 'center', zIndex: 1, pointerEvents: 'auto'
        }}
      >
        <div style={{
          background: 'rgba(10,11,13,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 16, padding: '20px 40px',
          display: 'flex', alignItems: 'center', gap: 32,
          boxShadow: '0 10px 40px rgba(239,68,68,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="blink" style={{ fontSize: 32 }}>🚨</span>
            <div>
              <div style={{ fontSize: 12, color: 'var(--red-critical)', fontWeight: 700, letterSpacing: '0.1em' }}>
                ACTIVE EMERGENCY: {emergencySeverity} SEVERITY
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {emergencyType?.replace('_', ' ')} PROTOCOL
              </div>
            </div>
          </div>

          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />

          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em' }}>TIME ELAPSED</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--red-critical)', fontFamily: 'JetBrains Mono, monospace' }}>
              {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scan Lines Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(rgba(239,68,68,0.03) 50%, rgba(0,0,0,0) 50%)',
        backgroundSize: '100% 4px', pointerEvents: 'none', opacity: 0.5
      }} />

      {/* Bottom Emergency Action Bar -> only pointer events auto on the buttons */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          zIndex: 1, pointerEvents: 'none' // Important to not block entire screen bottom
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <button style={{
            padding: '12px 24px', borderRadius: 8, background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>📢</span> Trigger PA System Announcement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
