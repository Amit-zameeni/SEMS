'use client';

import { useSemsStore, PlantId, Employee } from '@/lib/store';
import { PLANTS } from '@/lib/data';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

// For simplicity in a single map view, we just plot them all on one coordinate plane.
// We can color the dots by plant using `PLANTS` colors.
const plantColorMap = new Map(PLANTS.map(p => [p.id, p.color]));

function AssemblyPointZone({ id, label, x, y }: any) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: 48, height: 48,
      transform: 'translate(-50%, -50%)',
      border: `1.5px dashed rgba(255,255,255,0.4)`,
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', top: '100%', marginTop: 6, fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {label}
      </div>
    </div>
  );
}

function EmployeeDot({ emp }: { emp: Employee }) {
  const { selectEmployee, emergencyActive } = useSemsStore();

  const isSafe = emp.status === 'SAFE';
  const isMissing = emp.status === 'MISSING';
  
  // Use current pos if not active, or if missing.
  // If safe, they should visually be near their AP.
  const locX = (emergencyActive && isSafe) ? emp.targetLocation.x : emp.location.x;
  const locY = (emergencyActive && isSafe) ? emp.targetLocation.y : emp.location.y;

  // In normal mode, color dots by department or plant. We'll use plant color here for variety.
  const plantColor = plantColorMap.get(emp.plant) || 'var(--blue-accent)';

  let bg = plantColor;
  let border = 'transparent';
  let z = 10;
  let shadow = 'none';

  if (emergencyActive) {
    if (isMissing) {
      bg = 'var(--red-critical)';
      border = 'rgba(239,68,68,0.5)';
      z = 40;
      shadow = '0 0 10px rgba(239,68,68,0.8)';
    } else if (isSafe) {
      bg = 'var(--green-safe)';
    } else {
      bg = 'var(--amber-warn)';
      z = 20;
    }
  }

  return (
    <div
      onClick={() => selectEmployee(emp)}
      data-tooltip={`${emp.name} — ${emp.phone}`}
      title={`${emp.name} — ${emp.phone}\nRole: ${emp.role}\nStatus: ${emp.status}`}
      style={{
        position: 'absolute',
        left: `${locX}%`, top: `${locY}%`,
        transform: 'translate(-50%, -50%)',
        width: 8, height: 8, borderRadius: '50%',
        background: bg,
        border: `2px solid ${emergencyActive ? 'var(--bg-surface)' : border}`,
        cursor: 'pointer', zIndex: z,
        boxShadow: shadow,
        transition: 'left 1s ease-in-out, top 1s ease-in-out, background 0.3s',
      }}
      className={isMissing && emergencyActive ? 'pulse-dot' : ''}
    />
  );
}

export default function DigitalTwin() {
  const { employees, assemblyPoints, emergencyActive, commandPaletteOpen } = useSemsStore();
  const [zoom, setZoom] = useState(1);
  const [panOrigin, setPanOrigin] = useState({ x: 50, y: 50 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 24, gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Digital Twin — Facility Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Live geospatial positioning for {employees.length.toLocaleString()} personnel across {PLANTS.length} plants and {assemblyPoints.length} global assembly points.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setZoom(z => Math.min(z + 0.5, 3))} className="card" style={{ padding: '8px 12px', background: 'var(--bg-surface)' }}>+</button>
          <button onClick={() => setZoom(1)} className="card" style={{ padding: '8px 12px', background: 'var(--bg-surface)' }}>RESET VIEW</button>
          <button onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="card" style={{ padding: '8px 12px', background: 'var(--bg-surface)' }}>-</button>
        </div>
      </div>

      {/* Map Area */}
      <div className="card" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0b0e' }}>
        
        {/* Grid Background Pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundSize: '80px 80px',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        }} />

        {/* Scalable Container */}
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          style={{ position: 'absolute', inset: 0, transformOrigin: `${panOrigin.x}% ${panOrigin.y}%` }}
        >
          {/* Abstract Plant Block Outlines */}
          {PLANTS.map((p, i) => (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${10 + (i % 5) * 18}%`, top: `${10 + Math.floor(i / 5) * 40}%`,
              width: '16%', height: '30%',
              border: `1px solid ${p.color}40`,
              background: `linear-gradient(135deg, ${p.color}05, ${p.color}15)`,
              borderRadius: 8,
              padding: 8,
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: p.color, opacity: 0.6 }}>{p.id}</div>
            </div>
          ))}

          {/* Assembly Points */}
          {assemblyPoints.map(ap => (
            <AssemblyPointZone key={ap.id} id={ap.id} label={ap.label} x={ap.x} y={ap.y} />
          ))}

          {/* 1500 Employees */}
          {employees.map(emp => (
            <EmployeeDot key={emp.id} emp={emp} />
          ))}
        </motion.div>
        
        {/* Map Legend Overlay */}
        <div style={{
          position: 'absolute', bottom: 20, right: 20,
          background: 'rgba(10,12,18,0.85)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)', borderRadius: 10,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
          zIndex: 60, boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <h4 style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LIVE LEGEND</h4>
          {emergencyActive ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green-safe)' }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Reached Assembly</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber-warn)' }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>In Transit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="pulse-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red-critical)' }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Missing / SOS</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-muted)' }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Personnel (Colored by Plant)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.4)' }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Global Assembly Point (10)</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
