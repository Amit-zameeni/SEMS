'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSemsStore } from '@/lib/store';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import DigitalTwin from './DigitalTwin';
import EmployeesView from './EmployeesView';
import DrillsView from './DrillsView';
import ReportsView from './ReportsView';
import SettingsView from './SettingsView';
import EmployeeDrawer from './EmployeeDrawer';
import EmergencyOverlay from './EmergencyOverlay';
import CommandPalette from './CommandPalette';
import ToastContainer from './ToastContainer';
import ReportModal from './ReportModal';

export default function AppShell() {
  const {
    activeView, emergencyActive, selectedEmployee, sidebarCollapsed,
    commandPaletteOpen, reportModalOpen, toggleCommandPalette
  } = useSemsStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleCommandPalette();
    }
  }, [toggleCommandPalette]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const viewComponents = {
    dashboard: <Dashboard />,
    'digital-twin': <DigitalTwin />,
    employees: <EmployeesView />,
    drills: <DrillsView />,
    reports: <ReportsView />,
    settings: <SettingsView />,
  } as Record<string, React.ReactNode>;

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-primary)',
      position: 'relative',
    }} className={emergencyActive ? 'emergency-mode' : ''}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar />
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: '100%' }}
            >
              {viewComponents[activeView] || <Dashboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Employee Drawer */}
      <AnimatePresence>
        {selectedEmployee && <EmployeeDrawer />}
      </AnimatePresence>

      {/* Emergency Overlay */}
      <AnimatePresence>
        {emergencyActive && <EmergencyOverlay />}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {reportModalOpen && <ReportModal />}
      </AnimatePresence>

      {/* Toast */}
      <ToastContainer />
    </div>
  );
}
