'use client';

import { useSemsStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ReportModal() {
  const { toggleReport } = useSemsStore();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32
    }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleReport}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: 500, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
          borderRadius: 20, position: 'relative', zIndex: 101, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Generate Report</h2>
          <button onClick={toggleReport} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {complete ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', paddingTop: 24, paddingBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: 'var(--green-safe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                ✓
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Report SEC-8472 Ready</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Your post-incident review has been compiled.</p>
              </div>
              <button onClick={toggleReport} style={{ padding: '12px 24px', borderRadius: 8, background: 'var(--green-safe)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 }}>
                Download PDF
              </button>
            </motion.div>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>REPORT TYPE</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}>
                  <option>Post-Incident Review</option>
                  <option>OSHA Compliance Summary</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>DATE RANGE</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input type="date" className="card" style={{ flex: 1, padding: 12, color: 'var(--text-primary)', outline: 'none' }} />
                  <input type="date" className="card" style={{ flex: 1, padding: 12, color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <button
                onClick={generate}
                disabled={loading}
                style={{
                  padding: '14px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
                }}
              >
                {loading ? (
                   <span style={{ display: 'flex', gap: 4 }}>
                     <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                     <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
                   </span>
                ) : 'Generate Document'}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
