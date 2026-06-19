'use client';

import { useSemsStore, PlantId } from '@/lib/store';
import { PLANTS } from '@/lib/data';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeesView() {
  const { employees, setFilter, filterPlant, filterStatus, filterSearch, selectEmployee } = useSemsStore();
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const filtered = useMemo(() => {
    return employees.filter(e => {
      if (filterPlant !== 'ALL' && e.plant !== filterPlant) return false;
      if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
      if (filterSearch) {
        const q = filterSearch.toLowerCase();
        if (!e.name.toLowerCase().includes(q) && !e.badge.toLowerCase().includes(q) && !e.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [employees, filterPlant, filterStatus, filterSearch]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when filters change
  useMemo(() => setPage(1), [filterPlant, filterStatus, filterSearch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 32, gap: 24, overflow: 'hidden' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Personnel Directory</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {employees.length.toLocaleString()} total enrolled personnel across {PLANTS.length} facilities.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <input
          placeholder="Search by name, badge, dept..."
          value={filterSearch}
          onChange={e => setFilter('filterSearch', e.target.value)}
          className="card"
          style={{ padding: '12px 16px', width: 300, color: 'var(--text-primary)', outline: 'none' }}
        />
        
        <select
          className="card"
          value={filterPlant}
          onChange={e => setFilter('filterPlant', e.target.value)}
          style={{ padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="ALL">All Plants ({PLANTS.length})</option>
          {PLANTS.map(p => (
            <option key={p.id} value={p.id}>{p.id} — {p.fullName}</option>
          ))}
        </select>

        <select
          className="card"
          value={filterStatus}
          onChange={e => setFilter('filterStatus', e.target.value)}
          style={{ padding: '12px 16px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="SAFE">Safe / Accounted</option>
          <option value="MISSING">Missing / Unaccounted</option>
          <option value="PENDING">In Transit / Pending</option>
        </select>
        
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> results
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 180px 100px 140px 100px 140px 120px 80px 1fr',
          padding: '12px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
          fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em'
        }}>
          <div>PFP</div><div>EMPLOYEE INFO</div><div>BADGE</div><div>DEPT / ROLE</div><div>PLANT</div><div>AP</div><div>STATUS</div><div>RISK</div><div>LAST SEEN</div>
        </div>
        
        {/* Rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <AnimatePresence>
            {paginated.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => selectEmployee(e)}
                style={{
                  display: 'grid', gridTemplateColumns: '60px 180px 100px 140px 100px 140px 120px 80px 1fr',
                  padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)',
                  alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseOver={ev => (ev.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseOut={ev => (ev.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {e.photo}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{e.phone}</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)' }}>{e.badge}</div>
                <div>
                  <div style={{ fontSize: 12 }}>{e.department}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.role}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{e.plant}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.assemblyPoint}</div>
                <div>
                  <span style={{
                    fontSize: 10, padding: '4px 10px', borderRadius: 100, fontWeight: 700,
                    background: e.status === 'SAFE' ? 'rgba(34,197,94,0.1)' : e.status === 'MISSING' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)',
                    color: e.status === 'SAFE' ? 'var(--green-safe)' : e.status === 'MISSING' ? 'var(--red-critical)' : 'var(--blue-accent)',
                  }}>
                    {e.status}
                  </span>
                </div>
                <div>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700,
                    background: e.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.1)' : e.riskLevel === 'MEDIUM' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                    color: e.riskLevel === 'HIGH' ? 'var(--red-critical)' : e.riskLevel === 'MEDIUM' ? 'var(--amber-warn)' : 'var(--green-safe)',
                  }}>
                    {e.riskLevel}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: e.status === 'MISSING' ? 'var(--amber-warn)' : 'var(--text-secondary)' }}>
                  {e.lastSeen}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {paginated.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No personnel found matching filters.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page === 1 ? 'default' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page === totalPages ? 'default' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
