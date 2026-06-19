'use client';

import { useSemsStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function CommandPalette() {
  const { toggleCommandPalette, setActiveView, toggleReport, activateEmergency } = useSemsStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands = [
    { label: 'Go to Command Center', action: () => setActiveView('dashboard'), icon: '⬡' },
    { label: 'Go to Digital Twin', action: () => setActiveView('digital-twin'), icon: '◈' },
    { label: 'Go to Personnel Directory', action: () => setActiveView('employees'), icon: '◻' },
    { label: 'Generate Report', action: toggleReport, icon: '📄' },
    { label: 'TRIGGER EMERGENCY PROTOCOL', action: () => activateEmergency('FIRE', 'HIGH'), icon: '🚨', danger: true },
  ];

  const filtered = query 
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '15vh'
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleCommandPalette}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        style={{
          width: 600, background: 'var(--bg-elevated)', borderRadius: 12,
          border: '1px solid var(--border-default)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)', position: 'relative', zIndex: 201
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 18, color: 'var(--text-muted)', marginRight: 12 }}>🔍</span>
          <input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', color: '#fff',
              fontSize: 18, outline: 'none', fontWeight: 500
            }}
          />
          <span style={{ fontSize: 11, padding: '2px 6px', background: 'var(--bg-surface)', borderRadius: 4, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>ESC</span>
        </div>
        
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px' }}>
          {filtered.map((cmd, i) => (
            <div
              key={i}
              onClick={() => { cmd.action(); toggleCommandPalette(); }}
              onMouseOver={e => e.currentTarget.style.background = cmd.danger ? 'rgba(239,68,68,0.1)' : 'var(--bg-surface)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: 8, cursor: 'pointer', transition: 'background 0.1s',
                color: cmd.danger ? 'var(--red-critical)' : 'var(--text-primary)'
              }}
            >
              <span style={{ fontSize: 16 }}>{cmd.icon}</span>
              <span style={{ fontWeight: cmd.danger ? 700 : 500, fontSize: 14 }}>{cmd.label}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No commands found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
