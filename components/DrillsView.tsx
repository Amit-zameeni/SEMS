'use client';

import { useSemsStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function DrillsView() {
  const { drills } = useSemsStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 32, gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Drill Log & History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Historical record of all evacuation drills and emergency events.</p>
        </div>
        <button style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
          Schedule Drill
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>AVERAGE ACCOUNTABILITY</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>96.1%</div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>AVERAGE EVAC TIME</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>4.6 <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>min</span></div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>DRILLS THIS YEAR</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>5</div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 200px 100px 150px 150px 80px', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          <div>DATE</div>
          <div>TYPE</div>
          <div>DURATION</div>
          <div>ACCOUNTED %</div>
          <div>AVG RESPONSE</div>
          <div>GRADE</div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {drills.map((d, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={d.id}
              style={{ display: 'grid', gridTemplateColumns: '120px 200px 100px 150px 150px 80px', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{d.date}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.type}</div>
              <div style={{ fontSize: 13 }}>{Math.floor(d.duration / 60)}m {d.duration % 60}s</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${d.accountedPercent}%`, height: '100%', background: d.accountedPercent > 95 ? 'var(--green-safe)' : 'var(--amber-warn)' }} />
                </div>
                <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{d.accountedPercent}%</div>
              </div>
              <div style={{ fontSize: 13 }}>{d.avgResponseTime} min</div>
              <div>
                <span style={{
                  padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                  background: d.grade === 'A' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  color: d.grade === 'A' ? 'var(--green-safe)' : 'var(--amber-warn)'
                }}>
                  {d.grade}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
