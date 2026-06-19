'use client';

import { useSemsStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { PLANTS } from '@/lib/data';

export default function EmployeeDrawer() {
  const { selectedEmployee, selectEmployee, emergencyActive, updateEmployeeStatus } = useSemsStore();

  if (!selectedEmployee) return null;

  const e = selectedEmployee;
  const plantDetails = PLANTS.find(p => p.id === e.plant);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => selectEmployee(null)}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          zIndex: 80, cursor: 'pointer'
        }}
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 480, background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
          zIndex: 90, display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                border: `2px solid ${e.status === 'MISSING' ? 'var(--red-critical)' : e.status === 'SAFE' ? 'var(--green-safe)' : 'var(--blue-accent)'}`
              }}>
                {e.photo}
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{e.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.role} • {e.department}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}># {e.badge}</div>
              </div>
            </div>
            <button
              onClick={() => selectEmployee(null)}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: '50%', width: 32, height: 32, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 700, border: '1px solid var(--border-default)' }}>
              Plant {e.plant}
            </span>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 700, border: '1px solid var(--border-default)' }}>
              AP: {e.assemblyPoint}
            </span>
            <span style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 100, fontWeight: 700,
              background: e.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
              color: e.riskLevel === 'HIGH' ? 'var(--red-critical)' : 'var(--amber-warn)',
            }}>
              {e.riskLevel} RISK
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          
          {/* Status Banner */}
          <div style={{
            padding: '20px', borderRadius: 12, marginBottom: 32,
            background: e.status === 'MISSING' ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(153,27,27,0.1))' :
                        e.status === 'SAFE' ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(21,128,61,0.1))' : 'rgba(59,130,246,0.1)',
            border: `1px solid ${e.status === 'MISSING' ? 'rgba(239,68,68,0.4)' :
                                 e.status === 'SAFE' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>CURRENT STATUS</div>
              <div style={{
                fontSize: 22, fontWeight: 900, letterSpacing: '0.02em',
                color: e.status === 'MISSING' ? 'var(--red-critical)' :
                       e.status === 'SAFE' ? 'var(--green-safe)' : 'var(--blue-accent)'
              }}>
                {e.status}
              </div>
            </div>
            {emergencyActive && e.status === 'MISSING' && (
              <button
                onClick={() => updateEmployeeStatus(e.id, 'SAFE')}
                style={{
                  padding: '10px 20px', borderRadius: 8,
                  background: 'var(--green-safe)', color: '#fff', border: 'none',
                  fontWeight: 700, cursor: 'pointer', fontSize: 13, boxShadow: '0 4px 12px rgba(34,197,94,0.2)'
                }}
              >
                ✓ Mark Safe
              </button>
            )}
          </div>

          {/* Details Grid */}
          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 16 }}>PERSONNEL DETAILS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>PHONE EXTENSION</div>
              <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono' }}>{e.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>ASSIGNED FACILITY</div>
              <div style={{ fontSize: 13 }}>{plantDetails?.fullName || e.plant}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>LAST SEEN</div>
              <div style={{ fontSize: 13, color: 'var(--amber-warn)' }}>{e.lastSeen}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>ARRIVAL TIME</div>
              <div style={{ fontSize: 13 }}>{e.arrivalTime || '—'}</div>
            </div>
          </div>

          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>SYSTEM TIMELINE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
            {e.timeline.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 44, fontSize: 11, fontWeight: 600, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', paddingTop: 1 }}>{item.time}</div>
                <div style={{ position: 'relative', flex: 1, paddingBottom: idx !== e.timeline.length - 1 ? 24 : 0, borderLeft: idx !== e.timeline.length - 1 ? '1px solid var(--border-subtle)' : '1px solid transparent', paddingLeft: 24 }}>
                  <div style={{ position: 'absolute', left: -5, top: 4, width: 9, height: 9, borderRadius: '50%', background: item.type === 'success' ? 'var(--green-safe)' : item.type === 'warn' ? 'var(--amber-warn)' : 'var(--blue-accent)', boxShadow: `0 0 10px ${item.type === 'success' ? 'rgba(34,197,94,0.4)' : item.type === 'warn' ? 'rgba(245,158,11,0.4)' : 'transparent'}` }} />
                  <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--text-primary)' }}>{item.event}</div>
                </div>
              </div>
            ))}
            {e.timeline.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No recent activity.</div>}
          </div>

        </div>

        {/* Action Bar */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 12, background: 'var(--bg-elevated)' }}>
          <button style={{ flex: 1, padding: 12, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
            Message Profile
          </button>
          {emergencyActive && e.status === 'MISSING' && (
            <button style={{ flex: 1, padding: 12, borderRadius: 8, background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
              Escalate Search
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
