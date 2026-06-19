'use client';

import { motion } from 'framer-motion';
import { useSemsStore, ActiveView } from '@/lib/store';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: string;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Command Center', icon: '⬡' },
  { id: 'digital-twin', label: 'Digital Twin', icon: '◈' },
  { id: 'employees', label: 'Employees', icon: '◻', badge: '1247' },
  { id: 'drills', label: 'Drill Log', icon: '◉', badge: '247' },
  { id: 'reports', label: 'Reports', icon: '▦' },
  { id: 'settings', label: 'Settings', icon: '◎' },
];

export default function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar, emergencyActive } = useSemsStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0, zIndex: 20,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: sidebarCollapsed ? '0 16px' : '0 20px',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 10, flexShrink: 0,
        background: emergencyActive ? 'rgba(239,68,68,0.08)' : 'transparent',
        transition: 'background 0.5s',
      }}>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          background: emergencyActive
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #f97316, #ea580c)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: emergencyActive ? '0 0 16px rgba(239,68,68,0.4)' : '0 0 16px rgba(249,115,22,0.2)',
          transition: 'all 0.5s',
        }}>
          <span style={{ fontSize: 16 }}>{emergencyActive ? '🚨' : '⚡'}</span>
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>SEMS</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 500 }}>EMERGENCY SYSTEM</div>
          </motion.div>
        )}
      </div>

      {/* Plant status */}
      {!sidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            margin: '12px 12px', padding: '10px 12px',
            background: 'var(--bg-surface)', borderRadius: 8,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>PLANT STATUS</div>
          {['A', 'B', 'C'].map((plant) => (
            <div key={plant} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: emergencyActive && plant === 'A' ? '#ef4444' : '#22c55e',
              }} className={emergencyActive && plant === 'A' ? 'pulse-dot' : ''} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>Plant {plant}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {emergencyActive && plant === 'A' ? 'EVAC' : 'NORM'}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center',
                gap: sidebarCollapsed ? 0 : 10,
                padding: sidebarCollapsed ? '10px 0' : '10px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                color: isActive ? '#f97316' : 'var(--text-secondary)',
                fontSize: 11, fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.02em', width: '100%',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              data-tooltip={sidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 2px 2px 0',
                    background: '#f97316',
                  }}
                />
              )}
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-muted)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{item.badge}</span>
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={toggleSidebar}
          style={{
            width: '100%', height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, border: '1px solid var(--border-subtle)',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 12,
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>
    </motion.aside>
  );
}
