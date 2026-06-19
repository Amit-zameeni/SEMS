'use client';

export default function SettingsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 32, gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>System Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Global configuration for SEMS deployment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['General Settings', 'Emergency Protocols', 'Integration (Active Directory)', 'Hardware Scanners', 'Audit Logs'].map((t, i) => (
            <button key={t} style={{
              padding: '12px 16px', borderRadius: 8, background: i === 0 ? 'var(--bg-surface)' : 'transparent',
              border: i === 0 ? '1px solid var(--border-default)' : '1px solid transparent',
              color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'left', fontWeight: i === 0 ? 600 : 500, cursor: 'pointer'
            }}>
              {t}
            </button>
          ))}
        </div>
        
        <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Deployment Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>FACILITY NAME</label>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>Global Manufacturing Hub (Plant A, B, C)</div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM VERSION</label>
                <div style={{ fontSize: 14, fontFamily: 'JetBrains Mono', marginTop: 4 }}>SEMS OS 2.4.1 — Enterprise</div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Siren Configuration</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>Standard Evacuation Tone</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>30 seconds ON / 10 seconds OFF pulse</div>
              </div>
              <button style={{ padding: '6px 16px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>Test Audio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
