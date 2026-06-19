'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSemsStore } from '@/lib/store';

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
      {time.toLocaleTimeString('en-IN', { hour12: false })}
    </span>
  );
}

function Uptime({ seconds }: { seconds: number }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-muted)' }}>
      UP {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </span>
  );
}

export default function TopBar() {
  const {
    emergencyActive, emergencyType, connectionStatus,
    systemUptime, activateEmergency, deactivateEmergency,
    toggleCommandPalette, toggleReport, soundEnabled, toggleSound,
    setActiveView,
  } = useSemsStore();

  return (
    <div style={{
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 16,
      background: emergencyActive
        ? 'rgba(239,68,68,0.06)'
        : 'var(--bg-secondary)',
      borderBottom: `1px solid ${emergencyActive ? 'rgba(239,68,68,0.25)' : 'var(--border-subtle)'}`,
      transition: 'all 0.5s',
      zIndex: 30,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>SEMS</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/</span>
        {emergencyActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} className="pulse-dot" />
            <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: '0.04em' }}>
              EMERGENCY ACTIVE — {emergencyType?.replace('_', ' ')}
            </span>
          </motion.div>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Command Center</span>
        )}
      </div>

      {/* Center — time + uptime */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Clock />
        <Uptime seconds={systemUptime} />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
        {/* Connection */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 6,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
        }} data-tooltip="System Status">
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} className="pulse-dot" />
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, letterSpacing: '0.04em' }}>{connectionStatus}</span>
        </div>

        {/* Command Palette */}
        <button
          onClick={toggleCommandPalette}
          data-tooltip="Command Palette (⌘K)"
          style={{
            height: 32, padding: '0 10px', borderRadius: 6,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer', color: 'var(--text-muted)',
            fontSize: 11, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>⌘</span>
          <span>K</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          data-tooltip={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          style={{
            width: 32, height: 32, borderRadius: 6,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer', color: 'var(--text-muted)',
            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Report */}
        <button
          onClick={toggleReport}
          data-tooltip="Generate Report"
          style={{
            height: 32, padding: '0 12px', borderRadius: 6,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer', color: 'var(--text-secondary)',
            fontSize: 11, fontWeight: 500,
          }}
        >
          📄 Report
        </button>

        {/* Emergency button */}
        {!emergencyActive ? (
          <motion.button
            onClick={() => activateEmergency('FIRE', 'HIGH')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 32, padding: '0 14px', borderRadius: 6,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em',
              boxShadow: '0 0 20px rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>🚨</span> ACTIVATE EMERGENCY
          </motion.button>
        ) : (
          <motion.button
            onClick={deactivateEmergency}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 0 10px rgba(239,68,68,0.4)', '0 0 30px rgba(239,68,68,0.7)', '0 0 10px rgba(239,68,68,0.4)'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              height: 32, padding: '0 14px', borderRadius: 6,
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.5)',
              cursor: 'pointer', color: '#ef4444',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ■ STAND DOWN
          </motion.button>
        )}

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
          border: '2px solid rgba(249,115,22,0.3)',
        }} data-tooltip="Sanjay Mehta — Plant Manager">
          SM
        </div>
      </div>
    </div>
  );
}
