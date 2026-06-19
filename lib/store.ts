import { create } from 'zustand';
import { GENERATED_EMPLOYEES, ALL_AP_DEFS, PLANTS, APDefinition, GeneratedEmployee, PlantId } from './data';

export type EmergencyType = 'FIRE' | 'CHEMICAL_LEAK' | 'BOMB_THREAT' | 'MEDICAL_MASS' | 'EARTHQUAKE' | 'GAS_RELEASE' | 'EXPLOSION';
export type EmergencySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActiveView = 'landing' | 'dashboard' | 'digital-twin' | 'employees' | 'drills' | 'reports' | 'settings';

export { type GeneratedEmployee as Employee, type APDefinition, type PlantId };

export interface EmergencyReport {
  id: string;
  timestamp: Date;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  durationSeconds: number;
  totalEmployees: number;
  safeCount: number;
  missingCount: number;
  pendingCount: number;
  accountabilityRate: number;
  missingPersons: GeneratedEmployee[];
  plantBreakdown: {
    plant: string;
    total: number;
    safe: number;
    missing: number;
    pending: number;
  }[];
  apBreakdown: {
    apId: string;
    label: string;
    safe: number;
    missing: number;
    pending: number;
  }[];
}

export interface ActivityLog {
  id: string;
  time: string;
  event: string;
  type: 'info' | 'warn' | 'success' | 'critical';
  source: string;
}

export interface DrillRecord {
  id: string;
  date: string;
  type: string;
  duration: number;
  accountedPercent: number;
  avgResponseTime: number;
  grade: 'A' | 'B' | 'C' | 'D';
}

export interface SEMSState {
  activeView: ActiveView;
  sidebarCollapsed: boolean;
  selectedEmployee: GeneratedEmployee | null;
  commandPaletteOpen: boolean;
  reportModalOpen: boolean;
  viewingReport: EmergencyReport | null;
  soundEnabled: boolean;
  // Emergency
  emergencyActive: boolean;
  emergencyType: EmergencyType | null;
  emergencySeverity: EmergencySeverity;
  emergencyStartTime: Date | null;
  // Data
  employees: GeneratedEmployee[];
  assemblyPoints: APDefinition[];
  activityLogs: ActivityLog[];
  drills: DrillRecord[];
  emergencyReports: EmergencyReport[];
  connectionStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  systemUptime: number;
  // Filters (employees view)
  filterPlant: string;
  filterStatus: string;
  filterSearch: string;

  // Actions
  setActiveView: (view: ActiveView) => void;
  toggleSidebar: () => void;
  activateEmergency: (type: EmergencyType, severity: EmergencySeverity) => void;
  deactivateEmergency: () => void;
  selectEmployee: (emp: GeneratedEmployee | null) => void;
  toggleCommandPalette: () => void;
  setViewingReport: (r: EmergencyReport | null) => void;
  toggleReport: () => void;
  toggleSound: () => void;
  addLog: (log: Omit<ActivityLog, 'id'>) => void;
  updateEmployeeStatus: (id: string, status: 'SAFE' | 'MISSING' | 'PENDING') => void;
  tickUptime: () => void;
  setFilter: (key: 'filterPlant' | 'filterStatus' | 'filterSearch', val: string) => void;
}

const INITIAL_LOGS: ActivityLog[] = [
  { id:'1', time:'--:--:--', event:'SEMS Platform initialized — all subsystems nominal', type:'success', source:'SYSTEM' },
  { id:'2', time:'--:--:--', event:'Badge scanner network — 33 scanners online',         type:'success', source:'SCANNER'},
  { id:'3', time:'--:--:--', event:'PA system self-test complete',                        type:'info',    source:'AUDIO'  },
  { id:'4', time:'--:--:--', event:'Active Directory sync complete — 1500 records',       type:'success', source:'AD'     },
  { id:'5', time:'--:--:--', event:'Weather alert: wind NNE 12 km/h (evac consideration)',type:'warn',    source:'WEATHER'},
];

const INITIAL_DRILLS: DrillRecord[] = [
  { id:'D001', date:'2026-06-12', type:'Fire Evacuation — Full Site',         duration:324, accountedPercent:97.2, avgResponseTime:4.1, grade:'A' },
  { id:'D002', date:'2026-05-28', type:'Chemical Spill — ALCP & CP Plants',   duration:412, accountedPercent:94.8, avgResponseTime:5.3, grade:'B' },
  { id:'D003', date:'2026-05-14', type:'Gas Release — CSF Sector',            duration:298, accountedPercent:98.5, avgResponseTime:3.8, grade:'A' },
  { id:'D004', date:'2026-04-30', type:'Bomb Threat — TECHNICAL OFFICE',      duration:520, accountedPercent:91.3, avgResponseTime:6.7, grade:'B' },
  { id:'D005', date:'2026-04-15', type:'Earthquake Protocol — All Plants',    duration:287, accountedPercent:99.1, avgResponseTime:3.2, grade:'A' },
  { id:'D006', date:'2026-03-22', type:'Medical Mass Casualty',               duration:390, accountedPercent:96.4, avgResponseTime:4.6, grade:'A' },
];

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

function buildReport(
  state: Pick<SEMSState, 'employees' | 'assemblyPoints' | 'emergencyType' | 'emergencySeverity' | 'emergencyStartTime'>
): EmergencyReport {
  const emps = state.employees;
  const safe = emps.filter(e => e.status === 'SAFE');
  const missing = emps.filter(e => e.status === 'MISSING');
  const pending = emps.filter(e => e.status === 'PENDING');
  const duration = state.emergencyStartTime
    ? Math.floor((Date.now() - state.emergencyStartTime.getTime()) / 1000)
    : 0;

  const plantBreakdown = PLANTS.map(p => {
    const pe = emps.filter(e => e.plant === p.id);
    return {
      plant: p.id,
      total: pe.length,
      safe: pe.filter(e => e.status === 'SAFE').length,
      missing: pe.filter(e => e.status === 'MISSING').length,
      pending: pe.filter(e => e.status === 'PENDING').length,
    };
  });

  const apBreakdown = state.assemblyPoints.map(ap => {
    const ae = emps.filter(e => e.assemblyPoint === ap.id);
    return {
      apId: ap.id,
      label: ap.label,
      safe: ae.filter(e => e.status === 'SAFE').length,
      missing: ae.filter(e => e.status === 'MISSING').length,
      pending: ae.filter(e => e.status === 'PENDING').length,
    };
  });

  return {
    id: `INC-${Date.now()}`,
    timestamp: new Date(),
    emergencyType: state.emergencyType!,
    severity: state.emergencySeverity,
    durationSeconds: duration,
    totalEmployees: emps.length,
    safeCount: safe.length,
    missingCount: missing.length,
    pendingCount: pending.length,
    accountabilityRate: Math.round((safe.length / emps.length) * 100),
    missingPersons: missing,
    plantBreakdown,
    apBreakdown,
  };
}

export const useSemsStore = create<SEMSState>((set, get) => ({
  activeView: 'landing',
  sidebarCollapsed: false,
  selectedEmployee: null,
  commandPaletteOpen: false,
  reportModalOpen: false,
  viewingReport: null,
  soundEnabled: true,
  emergencyActive: false,
  emergencyType: null,
  emergencySeverity: 'HIGH',
  emergencyStartTime: null,
  employees: GENERATED_EMPLOYEES,
  assemblyPoints: ALL_AP_DEFS,
  activityLogs: INITIAL_LOGS,
  drills: INITIAL_DRILLS,
  emergencyReports: [],
  connectionStatus: 'ONLINE',
  systemUptime: 1847293,
  filterPlant: 'ALL',
  filterStatus: 'ALL',
  filterSearch: '',

  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  activateEmergency: (type, severity) => {
    set({
      emergencyActive: true, emergencyType: type,
      emergencySeverity: severity, emergencyStartTime: new Date(),
    });
    get().addLog({ time: now(), event: `🚨 ${type.replace('_', ' ')} emergency declared — all assembly protocols activated`, type: 'critical', source: 'SYSTEM' });
    get().addLog({ time: now(), event: 'PA siren system activated — all zones', type: 'warn', source: 'AUDIO' });
    get().addLog({ time: now(), event: 'SMS alert dispatched to 1500 employees', type: 'info', source: 'COMMS' });
    get().addLog({ time: now(), event: 'Emergency services notified — Fire, Medical, Security', type: 'info', source: 'EXTERNAL' });
  },

  deactivateEmergency: () => {
    const s = get();
    const report = buildReport({
      employees: s.employees, assemblyPoints: s.assemblyPoints,
      emergencyType: s.emergencyType, emergencySeverity: s.emergencySeverity,
      emergencyStartTime: s.emergencyStartTime,
    });
    set((prev) => ({
      emergencyActive: false, emergencyType: null, emergencyStartTime: null,
      emergencyReports: [report, ...prev.emergencyReports],
      viewingReport: report,
    }));
    get().addLog({ time: now(), event: `All-clear declared — Incident ${report.id} closed. Report generated.`, type: 'success', source: 'SYSTEM' });
    // Auto-navigate to the report
    setTimeout(() => {
      set({ activeView: 'reports' });
    }, 800);
  },

  selectEmployee: (emp) => set({ selectedEmployee: emp }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setViewingReport: (r) => set({ viewingReport: r }),
  toggleReport: () => set((s) => ({ reportModalOpen: !s.reportModalOpen })),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  addLog: (log) => set((s) => ({
    activityLogs: [{ ...log, id: Date.now().toString() + Math.random() }, ...s.activityLogs.slice(0, 99)]
  })),

  updateEmployeeStatus: (id, status) => {
    set((s) => ({ employees: s.employees.map(e => e.id === id ? { ...e, status } : e) }));
    const emp = get().employees.find(e => e.id === id);
    if (emp) get().addLog({ time: now(), event: `${emp.name} (${emp.badge}) manually marked ${status}`, type: 'info', source: 'MANUAL' });
  },

  tickUptime: () => set((s) => ({ systemUptime: s.systemUptime + 1 })),
  setFilter: (key, val) => set({ [key]: val } as any),
}));
