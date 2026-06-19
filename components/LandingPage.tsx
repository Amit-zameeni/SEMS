'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { useSemsStore } from '@/lib/store';

// Animated particle
interface Particle {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
}

function IndustrialGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particlesRef.current = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let offset = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(249,115,22,0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      const off = offset % gridSize;
      for (let x = -gridSize + off; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = -gridSize + off; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      offset += 0.15;

      // Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.opacity})`;
        ctx.fill();
      });

      // Connections
      particlesRef.current.forEach((a, i) => {
        particlesRef.current.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(249,115,22,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{value.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const { setActiveView } = useSemsStore();
  const [mounted, setMounted] = useState(false);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLaunch = () => setActiveView('dashboard');

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setActiveView('dashboard');
    }, 800);
  };

  const metrics = [
    { value: 1247, suffix: '', label: 'Employees Protected' },
    { value: 3, suffix: '.8 min', label: 'Avg Response Time' },
    { value: 12, suffix: '', label: 'Assembly Points' },
    { value: 247, suffix: '', label: 'Drills Completed' },
  ];

  return (
    <div style={{
      position: 'relative', minHeight: '100vh',
      background: 'linear-gradient(135deg, #070809 0%, #0d0f15 50%, #080a0e 100%)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <IndustrialGrid />

      {/* Radial gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(10,11,13,0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: '#f0f2f5' }}>SEMS</span>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 4,
            background: 'rgba(249,115,22,0.15)', color: '#f97316',
            border: '1px solid rgba(249,115,22,0.3)', letterSpacing: '0.08em',
            fontWeight: 600,
          }}>ENTERPRISE</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(34,197,94,0.3)',
            background: 'rgba(34,197,94,0.08)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} className="pulse-dot" />
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, letterSpacing: '0.04em' }}>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 680, padding: '0 24px' }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 100,
            border: '1px solid rgba(249,115,22,0.3)',
            background: 'rgba(249,115,22,0.08)',
            marginBottom: 32,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} className="pulse-dot" />
          <span style={{ fontSize: 11, color: '#f97316', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Smart Emergency Muster System
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(52px, 8vw, 84px)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.0,
            color: '#f0f2f5', marginBottom: 8,
          }}
        >
          SEM<span className="gradient-text">S</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 20, color: '#8892a4', lineHeight: 1.6,
            marginBottom: 48, fontWeight: 400,
          }}
        >
          Automatic employee accountability during<br />
          <span style={{ color: '#b0bac8' }}>emergency evacuation</span>. Real-time. Zero compromise.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}
        >
          <motion.button
            onClick={handleLaunch}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 32px', borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              border: 'none', cursor: 'pointer',
              color: '#fff', fontWeight: 700, fontSize: 15,
              letterSpacing: '-0.01em',
              boxShadow: '0 0 30px rgba(249,115,22,0.3), 0 4px 16px rgba(249,115,22,0.2)',
              transition: 'box-shadow 0.2s',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span>⚡</span> Launch Command Center
          </motion.button>
          <motion.button
            onClick={handleSimulate}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={simulating}
            style={{
              padding: '14px 32px', borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer', color: '#b0bac8',
              fontWeight: 600, fontSize: 15,
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span>▶</span> {simulating ? 'Loading...' : 'Watch Emergency Simulation'}
          </motion.button>
        </motion.div>

        {/* Metrics */}
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1, borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', background: 'rgba(255,255,255,0.04)',
            }}
          >
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                style={{
                  padding: '24px 16px', background: 'rgba(10,11,13,0.7)',
                  display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em',
                  color: '#f0f2f5', lineHeight: 1,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  <AnimatedCounter target={m.value} suffix={m.suffix} duration={1800 + i * 200} />
                </span>
                <span style={{ fontSize: 11, color: '#5a6478', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {m.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(10,11,13,0.7)', backdropFilter: 'blur(20px)',
      }}>
        {['ISO 9001:2015', 'OSHA 29 CFR 1910', 'IEC 61508 SIL2', '99.97% Uptime'].map((cert) => (
          <span key={cert} style={{ fontSize: 11, color: '#3a4050', fontWeight: 500, letterSpacing: '0.04em' }}>
            {cert}
          </span>
        ))}
      </div>
    </div>
  );
}
