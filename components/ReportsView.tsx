'use client';

import { useSemsStore, EmergencyReport } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { PLANTS } from '@/lib/data';

export default function ReportsView() {
  const { emergencyReports, drills, viewingReport, setViewingReport } = useSemsStore();
  const [tab, setTab] = useState<'INCIDENTS' | 'DRILLS'>('INCIDENTS');

  // Group missing persons by plant for the selected report
  const missingByPlant = useMemo(() => {
    if (!viewingReport || viewingReport.missingPersons.length === 0) return [];
    
    // Create buckets for each plant
    const map = new Map<string, any[]>();
    viewingReport.missingPersons.forEach(p => {
      if (!map.has(p.plant)) map.set(p.plant, []);
      map.get(p.plant)!.push(p);
    });

    // Sort plants to match PLANTS array order
    return PLANTS.map(p => ({
      plantId: p.id,
      plantName: p.fullName,
      color: p.color,
      missing: map.get(p.id) || []
    })).filter(g => g.missing.length > 0);
  }, [viewingReport]);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      
      {/* Left List Pane */}
      <div style={{ width: 340, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ padding: '24px 24px 16px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Documents</h1>
          <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 8, border: '1px solid var(--border-default)' }}>
            <button
              onClick={() => { setTab('INCIDENTS'); setViewingReport(emergencyReports[0] || null); }}
              style={{ flex: 1, padding: 8, borderRadius: 6, fontWeight: 600, fontSize: 11, cursor: 'pointer', border: 'none', background: tab === 'INCIDENTS' ? 'var(--bg-surface)' : 'transparent', color: tab === 'INCIDENTS' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              INCIDENTS
            </button>
            <button
              onClick={() => { setTab('DRILLS'); setViewingReport(null); }}
              style={{ flex: 1, padding: 8, borderRadius: 6, fontWeight: 600, fontSize: 11, cursor: 'pointer', border: 'none', background: tab === 'DRILLS' ? 'var(--bg-surface)' : 'transparent', color: tab === 'DRILLS' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              ROUTINE DRILLS
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
          {tab === 'INCIDENTS' && emergencyReports.map(r => (
            <div
              key={r.id}
              onClick={() => setViewingReport(r)}
              style={{
                padding: '16px', borderRadius: 8, cursor: 'pointer', marginBottom: 8,
                background: viewingReport?.id === r.id ? 'var(--bg-surface)' : 'transparent',
                border: viewingReport?.id === r.id ? '1px solid var(--border-default)' : '1px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{r.id}</span>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'rgba(239,68,68,0.1)', color: 'var(--red-critical)', fontWeight: 700 }}>
                  {r.severity}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{r.emergencyType.replace(/_/g, ' ')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {new Date(r.timestamp).toLocaleString()}
              </div>
            </div>
          ))}

          {tab === 'INCIDENTS' && emergencyReports.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No emergency incidents recorded.
            </div>
          )}

          {tab === 'DRILLS' && drills.map(d => (
            <div key={d.id} style={{ padding: '16px', borderRadius: 8, border: '1px solid var(--border-default)', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{d.type}</span>
                <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 100, background: d.grade === 'A' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: d.grade === 'A' ? 'var(--green-safe)' : 'var(--amber-warn)', fontWeight: 700 }}>Grade {d.grade}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{d.date}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Accountability: {d.accountedPercent}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {tab === 'INCIDENTS' && viewingReport ? (
            <motion.div
              key={viewingReport.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}
            >
              {/* Header */}
              <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', marginBottom: 12 }}>
                  POST-INCIDENT REPORT • {viewingReport.id}
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{viewingReport.emergencyType.replace(/_/g, ' ')}</h2>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Generated on {new Date(viewingReport.timestamp).toLocaleString()}</div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { l: 'ACCOUNTABILITY', v: `${viewingReport.accountabilityRate}%`, c: viewingReport.accountabilityRate === 100 ? 'var(--green-safe)' : 'var(--red-critical)' },
                  { l: 'TOTAL STAFF', v: viewingReport.totalEmployees, c: '#fff' },
                  { l: 'MISSING', v: viewingReport.missingCount, c: viewingReport.missingCount > 0 ? 'var(--red-critical)' : 'var(--text-muted)' },
                  { l: 'DURATION', v: `${Math.floor(viewingReport.durationSeconds / 60)}m ${viewingReport.durationSeconds % 60}s`, c: 'var(--blue-accent)' },
                ].map(k => (
                  <div key={k.l} className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>{k.l}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'JetBrains Mono', color: k.c, lineHeight: 1 }}>{k.v}</div>
                  </div>
                ))}
              </div>

              {/* Grouped Missing Details By Plant */}
              {missingByPlant.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-critical)' }} />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--red-critical)', letterSpacing: '0.08em' }}>
                      UNACCOUNTED PERSONNEL BY PLANT ({viewingReport.missingCount} RECORD{viewingReport.missingCount !== 1 ? 'S' : ''})
                    </h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {missingByPlant.map((group) => (
                      <div key={group.plantId} style={{ border: `1px solid ${group.color}40`, borderRadius: 12, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                        {/* Plant Sub-header */}
                        <div style={{ padding: '12px 20px', background: `${group.color}15`, borderBottom: `1px solid ${group.color}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: group.color, borderRadius: 2 }} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{group.plantId} — {group.plantName}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: group.color }}>{group.missing.length} MISSING</span>
                        </div>
                        
                        {/* Table */}
                        <div style={{ padding: 0 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: 10, color: 'var(--text-muted)' }}>
                                <th style={{ padding: '12px 20px', fontWeight: 600 }}>NAME</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600 }}>BADGE</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600 }}>DEPARTMENT</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600 }}>CONTACT NO.</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ASSIGNED AP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.missing.map((e: any, i: number) => (
                                <tr key={e.id} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 12 }}>
                                  <td style={{ padding: '12px 20px', fontWeight: 600 }}>{e.photo} {e.name}</td>
                                  <td style={{ padding: '12px 20px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>{e.badge}</td>
                                  <td style={{ padding: '12px 20px', color: 'var(--text-secondary)' }}>{e.department}</td>
                                  <td style={{ padding: '12px 20px', fontFamily: 'JetBrains Mono', color: 'var(--amber-warn)', fontWeight: 600 }}>{e.phone}</td>
                                  <td style={{ padding: '12px 20px', fontWeight: 600 }}>{e.assemblyPoint}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Breakdown */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>FULL PLANT SUMMARY</h3>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
                  {viewingReport.plantBreakdown.map((p, i) => (
                    <div key={p.plant} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: i < viewingReport.plantBreakdown.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ width: 140, fontWeight: 600, fontSize: 13 }}>{p.plant}</div>
                      <div style={{ flex: 1, display: 'flex', gap: 24, fontSize: 12 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total: {p.total}</span>
                        <span style={{ color: 'var(--green-safe)' }}>Safe: {p.safe}</span>
                        <span style={{ color: p.missing > 0 ? 'var(--red-critical)' : 'var(--text-muted)', fontWeight: p.missing > 0 ? 700 : 400 }}>Missing: {p.missing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AP Breakdown */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>ASSEMBLY POINT CLEARANCE</h3>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
                  {viewingReport.apBreakdown.map((ap, i) => (
                    <div key={ap.apId} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: i < viewingReport.apBreakdown.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div style={{ width: 140, fontWeight: 600, fontSize: 13, fontFamily: 'JetBrains Mono' }}>{ap.apId}</div>
                      <div style={{ flex: 1, display: 'flex', gap: 24, fontSize: 12 }}>
                        <span style={{ color: 'var(--green-safe)' }}>Safe: {ap.safe}</span>
                        <span style={{ color: ap.missing > 0 ? 'var(--red-critical)' : 'var(--text-muted)' }}>Missing: {ap.missing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button
                  style={{
                    padding: '12px 24px', borderRadius: 8, background: 'var(--green-safe)', color: '#fff', border: 'none',
                    fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
                  }}
                >
                  Download Complete PDF
                </button>
              </div>

            </motion.div>
          ) : (
            tab === 'INCIDENTS' && !viewingReport && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                Select an incident report from the list
              </div>
            )
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
