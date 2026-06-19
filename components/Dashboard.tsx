'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSemsStore } from '@/lib/store';
import { PLANTS } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';

function useElapsed(start: Date | null) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!start) return void setT(0);
    const i = setInterval(() => setT(Math.floor((Date.now() - start.getTime()) / 1000)), 1000);
    return () => clearInterval(i);
  }, [start]);
  return t;
}
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

/* ────────── Plant Status Row Card ────────── */
function PlantCard({ plant, employees, emergencyActive, delay }: any) {
  const { selectEmployee } = useSemsStore();
  const pe      = useMemo(() => employees.filter((e: any) => e.plant === plant.id), [employees, plant.id]);
  const safe    = pe.filter((e: any) => e.status === 'SAFE').length;
  const missing = pe.filter((e: any) => e.status === 'MISSING').length;
  const total   = pe.length;
  const pct     = total ? Math.round((safe / total) * 100) : 100;
  const alert   = missing > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', damping: 22 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 60px 60px 60px 1fr 80px',
        gap: 0,
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: alert && emergencyActive ? 'rgba(239,68,68,0.04)' : 'transparent',
        transition: 'background 0.4s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: alert && emergencyActive ? 'var(--red-critical)' : 'var(--green-safe)',
          flexShrink: 0,
        }} className={alert && emergencyActive ? 'pulse-dot' : ''} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 12 }}>{plant.name}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>{plant.fullName}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15 }}>{total}</div>
      <motion.div key={safe} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: 'var(--green-safe)' }}>{safe}</motion.div>
      <motion.div key={missing} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: missing > 0 ? 'var(--red-critical)' : 'var(--text-muted)' }}>{missing}</motion.div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              height: '100%', borderRadius: 4,
              background: pct >= 90 ? 'var(--green-safe)' : pct >= 70 ? 'var(--amber-warn)' : 'var(--red-critical)',
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: pct >= 90 ? 'var(--green-safe)' : pct >= 70 ? 'var(--amber-warn)' : 'var(--red-critical)' }}>
        {pct}%
      </div>
    </motion.div>
  );
}

/* ────────── Missing Persons Panel ────────── */
function MissingPanel({ missing }: { missing: any[] }) {
  const { selectEmployee, deactivateEmergency } = useSemsStore();
  const [genState, setGenState] = useState<'idle' | 'loading' | 'done'>('idle');
  
  const missingByPlant = useMemo(() => {
    if (missing.length === 0) return [];
    const map = new Map<string, any[]>();
    missing.forEach(p => {
      if (!map.has(p.plant)) map.set(p.plant, []);
      map.get(p.plant)!.push(p);
    });
    return PLANTS.map(p => ({
      plantId: p.id, color: p.color, missing: map.get(p.id) || []
    })).filter(g => g.missing.length > 0);
  }, [missing]);

  const high = missing.filter(e => e.riskLevel === 'HIGH');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      style={{
        border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: 12, overflow: 'hidden',
        background: 'rgba(12,4,4,0.7)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '11px 20px',
        background: 'rgba(239,68,68,0.09)',
        borderBottom: '1px solid rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-critical)' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--red-critical)', letterSpacing: '0.08em' }}>
            UNACCOUNTED PERSONNEL — {missing.length} RECORDS
            {high.length > 0 && <span style={{ marginLeft: 12, color: 'var(--amber-warn)', fontSize: 11 }}>⚠ {high.length} HIGH RISK</span>}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            onClick={() => { setGenState('loading'); setTimeout(() => setGenState('done'), 1800); }}
            disabled={genState !== 'idle'}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: genState !== 'idle' ? 'default' : 'pointer',
              background: genState === 'done' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${genState === 'done' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.35)'}`,
              color: genState === 'done' ? 'var(--green-safe)' : 'var(--red-critical)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {genState === 'done' ? '✓ Report Ready — Download PDF' : genState === 'loading' ?
              <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>⟳</motion.span> Generating…</> :
              '📋 Generate Missing Persons Report'}
          </motion.button>
          <button
            onClick={deactivateEmergency}
            style={{
              padding: '7px 16px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--green-safe)',
            }}
          >
            ■ Stand Down — All Clear
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {missingByPlant.map((group) => (
          <div key={group.plantId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ padding: '8px 20px', background: `${group.color}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{group.plantId}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: group.color }}>{group.missing.length} Missing</div>
            </div>
            
            <div style={{
              display: 'grid', gridTemplateColumns: '220px 80px 140px 100px 120px 80px',
              padding: '6px 20px', background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em',
            }}>
              <div>EMPLOYEE</div><div>BADGE</div><div>CONTACT NO.</div><div>ASSIGNED AP</div><div>LAST SEEN</div><div>RISK</div>
            </div>

            {group.missing.map((e: any) => (
              <motion.div
                key={e.id}
                onClick={() => selectEmployee(e)}
                style={{
                  display: 'grid', gridTemplateColumns: '220px 80px 140px 100px 120px 80px',
                  padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.02)',
                  alignItems: 'center', cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseOver={ev => (ev.currentTarget.style.background = 'rgba(239,68,68,0.07)')}
                onMouseOut={ev => (ev.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{e.photo}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{e.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.department}</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-secondary)' }}>{e.badge}</span>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--amber-warn)', fontWeight: 600 }}>{e.phone}</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{e.assemblyPoint}</span>
                <span style={{ fontSize: 11, color: 'var(--amber-warn)' }}>{e.lastSeen}</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, fontWeight: 700, background: e.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)', color: e.riskLevel === 'HIGH' ? 'var(--red-critical)' : 'var(--amber-warn)', width: 'fit-content' }}>
                  {e.riskLevel}
                </span>
              </motion.div>
            ))}
          </div>
        ))}
        {missingByPlant.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--green-safe)', fontWeight: 700 }}>
            ✓ All personnel accounted for
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ────────── Emergency View ────────── */
function EmergencyDashboard() {
  const { employees, assemblyPoints, emergencyStartTime, emergencyType, emergencySeverity, activityLogs } = useSemsStore();
  const elapsed  = useElapsed(emergencyStartTime);
  const safe     = useMemo(() => employees.filter(e => e.status === 'SAFE').length, [employees]);
  const missing  = useMemo(() => employees.filter(e => e.status === 'MISSING'), [employees]);
  const pending  = useMemo(() => employees.filter(e => e.status === 'PENDING').length, [employees]);
  const total    = employees.length;
  const pct      = Math.round((safe / total) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', height: '100%', gap: 0 }}>
      {/* Main content */}
      <div style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Giant accountability banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(10,11,13,0.96) 0%, rgba(22,6,6,0.9) 100%)',
            border: '1px solid rgba(239,68,68,0.35)', borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 0 50px rgba(239,68,68,0.1)',
          }}
        >
          <div style={{ padding: '10px 24px', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--red-critical)', letterSpacing: '0.1em' }}>
              <span className="blink" style={{ marginRight: 8 }}>🚨</span>
              {emergencyType?.replace(/_/g, ' ')} — {emergencySeverity} SEVERITY
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)' }}>T+{fmt(elapsed)} &nbsp;·&nbsp; {total.toLocaleString()} ENROLLED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { label: '✓ REACHED ASSEMBLY', val: safe, col: 'var(--green-safe)', pulse: false },
              { label: '✗ UNACCOUNTED', val: missing.length, col: missing.length > 0 ? 'var(--red-critical)' : 'var(--text-muted)', pulse: missing.length > 0 },
              { label: '→ IN TRANSIT', val: pending, col: 'var(--blue-accent)', pulse: false },
              { label: '% ACCOUNTABILITY', val: `${pct}%`, col: pct >= 90 ? 'var(--green-safe)' : pct >= 70 ? 'var(--amber-warn)' : 'var(--red-critical)', pulse: false },
            ].map((item, idx, arr) => (
              <>
                <motion.div
                  key={item.label}
                  animate={{ background: item.pulse ? ['rgba(239,68,68,0.03)', 'rgba(239,68,68,0.08)', 'rgba(239,68,68,0.03)'] : 'transparent' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: item.col, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.pulse && <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red-critical)' }} />}
                    {item.label}
                  </div>
                  <motion.div key={String(item.val)} initial={{ scale: 1.15, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, fontFamily: 'JetBrains Mono', letterSpacing: '-0.04em', color: item.col }}>
                    {item.val}
                  </motion.div>
                </motion.div>
                {idx < arr.length - 1 && <div key={`div-${idx}`} style={{ width: 1, background: 'rgba(255,255,255,0.06)', alignSelf: 'stretch' }} />}
              </>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ margin: '0 24px 16px', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: '100%', borderRadius: 6, background: pct >= 90 ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#dc2626,#ef4444)', boxShadow: `0 0 12px ${pct >= 90 ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}` }}
            />
          </div>
        </motion.div>

        {/* Plant breakdown table */}
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '140px 60px 60px 60px 1fr 80px', gap: 0, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            <div>PLANT / UNIT</div><div style={{ textAlign: 'right' }}>TOTAL</div><div style={{ textAlign: 'right', color: 'var(--green-safe)' }}>SAFE</div><div style={{ textAlign: 'right', color: 'var(--red-critical)' }}>MISSING</div><div style={{ paddingLeft: 16 }}>PROGRESS</div><div style={{ textAlign: 'right' }}>RATE</div>
          </div>
          {PLANTS.map((p, i) => (
            <PlantCard key={p.id} plant={p} employees={employees} emergencyActive delay={0.04 * i} />
          ))}
        </div>

        {/* Missing persons */}
        <MissingPanel missing={missing} />
      </div>

      {/* Right rail — live log */}
      <div style={{ borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-safe)' }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Live Event Stream</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence initial={false}>
            {activityLogs.slice(0, 25).map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 2, flexShrink: 0, borderRadius: 2, alignSelf: 'stretch', background: log.type === 'critical' ? 'var(--red-critical)' : log.type === 'warn' ? 'var(--amber-warn)' : log.type === 'success' ? 'var(--green-safe)' : 'var(--blue-accent)' }} />
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{log.time} · {log.source}</div>
                  <div style={{ fontSize: 11, lineHeight: 1.4 }}>{log.event}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ────────── Normal Dashboard ────────── */
function NormalDashboard() {
  const { employees, assemblyPoints, drills, activityLogs, activateEmergency, emergencyReports } = useSemsStore();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', height: '100%' }}>
      <div style={{ overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Command Center</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {employees.length.toLocaleString()} personnel · {PLANTS.length} plants · {assemblyPoints.length} assembly points · All systems nominal
            </p>
          </div>
          <motion.button
            onClick={() => activateEmergency('FIRE', 'HIGH')}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 18px rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            🚨 Activate Emergency Protocol
          </motion.button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { l: 'TOTAL ENROLLED', v: employees.length.toLocaleString(), s: '11 plants', c: 'var(--orange-primary)' },
            { l: 'ASSEMBLY POINTS', v: '33', s: '3 per plant · all active', c: 'var(--blue-accent)' },
            { l: 'INCIDENTS THIS YEAR', v: emergencyReports.length.toString(), s: 'Click Reports to review', c: 'var(--amber-warn)' },
            { l: 'LAST DRILL GRADE', v: 'A', s: '99.1% accountability', c: 'var(--green-safe)' },
          ].map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * i }} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>{k.l}</div>
              <div style={{ fontSize: 34, fontWeight: 900, fontFamily: 'JetBrains Mono', color: k.c, lineHeight: 1 }}>{k.v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{k.s}</div>
            </motion.div>
          ))}
        </div>

        {/* Plant status table */}
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 13, fontWeight: 700 }}>Plant Status — Normal Operations</h2>
          </div>
          <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '140px 60px 60px 60px 1fr 80px', gap: 0, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            <div>FACILITY</div><div style={{ textAlign: 'right' }}>STAFF</div><div style={{ textAlign: 'right' }}>ONLINE</div><div style={{ textAlign: 'right' }}>ALERTS</div><div style={{ paddingLeft: 16 }}>CAPACITY BAR</div><div style={{ textAlign: 'right' }}>STATUS</div>
          </div>
          {PLANTS.map((p, i) => <PlantCard key={p.id} plant={p} employees={employees} emergencyActive={false} delay={0.04 * i} />)}
        </div>

        {/* Recent drills row */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>RECENT DRILLS</h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            {drills.slice(0, 5).map((d, i) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 20px', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 800, flexShrink: 0, background: d.grade === 'A' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: d.grade === 'A' ? 'var(--green-safe)' : 'var(--amber-warn)' }}>{d.grade}</span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{d.type}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{d.date}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.accountedPercent}%</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{Math.floor(d.duration / 60)}m {d.duration % 60}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right log */}
      <div style={{ borderLeft: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>System Log</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activityLogs.map((log, i) => (
            <div key={log.id} style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 2, flexShrink: 0, borderRadius: 2, background: log.type === 'critical' ? 'var(--red-critical)' : log.type === 'warn' ? 'var(--amber-warn)' : log.type === 'success' ? 'var(--green-safe)' : 'var(--blue-accent)' }} />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>{log.time} · {log.source}</div>
                <div style={{ fontSize: 11, lineHeight: 1.4 }}>{log.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { emergencyActive } = useSemsStore();
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {emergencyActive
          ? <motion.div key="em" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ height: '100%' }}><EmergencyDashboard /></motion.div>
          : <motion.div key="norm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ height: '100%' }}><NormalDashboard /></motion.div>}
      </AnimatePresence>
    </div>
  );
}
