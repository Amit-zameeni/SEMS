/**
 * SEMS — Production Data Generator
 * Generates 1500 realistic employees across 11 plants with exactly 10 global assembly points
 */

export const PLANTS = [
  { id: 'ALCP',   name: 'ALCP',             fullName: 'Aluminium Chloride Production',    color: '#f97316' },
  { id: 'SBP',    name: 'SBP',              fullName: 'Sulphur & By-Products',            color: '#f59e0b' },
  { id: 'CP',     name: 'CP',               fullName: 'Chlorine Plant',                   color: '#ef4444' },
  { id: 'PAC',    name: 'PAC',              fullName: 'Poly-Aluminium Chloride',           color: '#8b5cf6' },
  { id: 'SRS',    name: 'SRS',              fullName: 'Sulphuric Recovery System',         color: '#3b82f6' },
  { id: 'PGD',    name: 'PGD',              fullName: 'Pipeline & Gas Distribution',       color: '#06b6d4' },
  { id: 'CSF',    name: 'CSF',              fullName: 'Chemical Storage Facility',         color: '#10b981' },
  { id: 'MEM-1',  name: 'MEM-1',            fullName: 'Membrane Unit – Block 1',           color: '#64748b' },
  { id: 'MEM-2',  name: 'MEM-2',            fullName: 'Membrane Unit – Block 2',           color: '#94a3b8' },
  { id: 'MEM-3',  name: 'MEM-3',            fullName: 'Membrane Unit – Block 3',           color: '#cbd5e1' },
  { id: 'TECHOFF',name: 'TECHNICAL OFFICE', fullName: 'Technical Office & Administration', color: '#a78bfa' },
] as const;

export type PlantId = typeof PLANTS[number]['id'];

export const DEPARTMENTS = [
  'Operations', 'Maintenance', 'Quality Control', 'Safety & EHS',
  'Engineering', 'Production', 'Logistics', 'Administration', 'IT',
  'Finance', 'HR', 'Procurement', 'Security', 'R&D', 'Legal',
];

export const ROLES: Record<string, string[]> = {
  'Operations':     ['Floor Supervisor', 'Shift Operator', 'Control Room Operator', 'Process Technician'],
  'Maintenance':    ['Lead Technician', 'Mechanical Fitter', 'Instrument Technician', 'Electrician'],
  'Quality Control':['QC Engineer', 'Inspector', 'Lab Analyst', 'QA Coordinator'],
  'Safety & EHS':   ['HSE Officer', 'Safety Coordinator', 'Fire Warden', 'EHS Manager'],
  'Engineering':    ['Process Engineer', 'Project Engineer', 'Design Engineer', 'Shift Engineer'],
  'Production':     ['Line Operator', 'Machine Operator', 'Production Supervisor', 'Batch Operator'],
  'Logistics':      ['Warehouse Lead', 'Forklift Operator', 'Logistics Coordinator', 'Material Handler'],
  'Administration': ['Office Manager', 'Admin Executive', 'Secretary', 'Records Clerk'],
  'IT':             ['Systems Admin', 'Network Engineer', 'Support Analyst', 'Data Engineer'],
  'Finance':        ['Controller', 'Accountant', 'Finance Analyst', 'Payroll Officer'],
  'HR':             ['Muster Coordinator', 'HR Manager', 'Recruiter', 'Training Lead'],
  'Procurement':    ['Buyer', 'Vendor Manager', 'Procurement Lead', 'Contracts Officer'],
  'Security':       ['Guard', 'Security Supervisor', 'CCTV Operator', 'Access Control Officer'],
  'R&D':            ['Lab Scientist', 'Research Engineer', 'R&D Analyst', 'Innovation Lead'],
  'Legal':          ['Compliance Officer', 'Legal Counsel', 'Contracts Manager', 'Regulatory Affairs'],
};

const FIRST_NAMES = [
  'Rajesh','Priya','Amit','Sunita','Vikram','Deepak','Meena','Kiran','Ananya','Sanjay',
  'Pooja','Rahul','Leela','Mohan','Farida','Suresh','Neha','Arjun','Divya','Rakesh',
  'Tina','Mahesh','Bindu','Omar','Kavita','Harish','Asha','Vinod','Rekha','Prakash',
  'Nisha','Girish','Usha','Ramesh','Lalita','Sunil','Kamla','Arun','Geeta','Ravi',
  'Seema','Manoj','Shanta','Dinesh','Mala','Yogesh','Sarita','Prem','Kanta','Naresh',
  'Rita','Bharat','Sushila','Kapil','Sudha','Ankur','Mamta','Vikas','Uma','Chetan',
  'Santosh','Chandni','Rakshit','Hemlata','Saurabh','Jyoti','Nitin','Pushpa','Ashok','Lata',
  'Ganesh','Savita','Rohit','Sunila','Tarun','Anita','Sudhir','Rani','Praveen','Shobha',
  'Mukesh','Alka','Arvind','Veena','Himanshu','Radha','Abhijeet','Bharti','Sandeep','Nirmala',
  'Dhruv','Lakshmi','Rishabh','Nalini','Siddharth','Vimala','Ankita','Kunal','Shreya','Paresh',
];
const LAST_NAMES = [
  'Kumar','Sharma','Singh','Patel','Nair','Verma','Reddy','Rao','Iyer','Mehta',
  'Gupta','Tiwari','Krishnan','Das','Bano','Babu','Jain','Pillai','Menon','Yadav',
  'Shah','Kulkarni','Nair','Shaikh','Mishra','Pandey','Tripathi','Pathak','Dubey','Joshi',
  'Srivastava','Agarwal','Bansal','Goel','Malhotra','Kapoor','Khanna','Bhatia','Grover','Sethi',
  'Chopra','Tandon','Bahl','Ahuja','Madan','Anand','Narang','Kohli','Mehra','Chadha',
];

const PHOTOS = ['👨‍🏭','👩‍🔬','👨‍🔧','👩‍💼','👮','👨‍💻','👩‍🏭','👨‍🏢','👩‍🔬','👔','👩‍💼','👨‍🔧','👩‍🚒','👨‍🏭','💂','👨‍🔬','👩‍💻','👩‍⚖️','👨‍🚒','👩‍🔧'];

function rng(seed: number) { return ((seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; }

export interface GeneratedEmployee {
  id: string;
  name: string;
  badge: string;
  department: string;
  role: string;
  plant: PlantId;
  assemblyPoint: string;
  status: 'SAFE' | 'MISSING' | 'PENDING';
  lastSeen: string;
  photo: string;
  phone: string;
  arrivalTime: string | null;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  location: { x: number; y: number };
  targetLocation: { x: number; y: number };
  timeline: { time: string; event: string; type: 'info' | 'warn' | 'success' }[];
}

export interface APDefinition {
  id: string;
  label: string;
  capacity: number;
  x: number; y: number;
}

// Exactly 10 global assembly points for the complex
const AP_DEFS: APDefinition[] = [
  { id: 'AP-1',  label: 'North Gate – Alpha',    capacity: 200, x: 14, y: 10 },
  { id: 'AP-2',  label: 'North Gate – Bravo',    capacity: 200, x: 32, y: 10 },
  { id: 'AP-3',  label: 'East Yard – Main',      capacity: 150, x: 50, y: 14 },
  { id: 'AP-4',  label: 'East Yard – Secondary', capacity: 150, x: 74, y: 14 },
  { id: 'AP-5',  label: 'South Plaza – Left',    capacity: 150, x: 12, y: 88 },
  { id: 'AP-6',  label: 'South Plaza – Right',   capacity: 150, x: 30, y: 88 },
  { id: 'AP-7',  label: 'West Field – A',        capacity: 150, x: 50, y: 88 },
  { id: 'AP-8',  label: 'West Field – B',        capacity: 150, x: 68, y: 88 },
  { id: 'AP-9',  label: 'Emergency Exit – N',    capacity: 100, x: 88, y: 34 },
  { id: 'AP-10', label: 'Emergency Exit – S',    capacity: 100, x: 88, y: 70 },
];

// Count per plant (total = 1500)
const PLANT_COUNTS: Record<string, number> = {
  'ALCP': 180, 'SBP': 150, 'CP': 160, 'PAC': 130, 'SRS': 140,
  'PGD': 120, 'CSF': 100, 'MEM-1': 100, 'MEM-2': 80, 'MEM-3': 80,
  'TECHOFF': 260
};

function generateEmployees(): GeneratedEmployee[] {
  const employees: GeneratedEmployee[] = [];
  let globalIdx = 0;

  for (const plant of PLANTS) {
    const count = PLANT_COUNTS[plant.id] ?? 100;
    
    // Each plant uses ~3 closest APs to distribute staff
    // We arbitrarily assign them for realistic scatter
    const plantSubAps = [
      AP_DEFS[globalIdx % 10],
      AP_DEFS[(globalIdx + 3) % 10],
      AP_DEFS[(globalIdx + 6) % 10]
    ];

    for (let i = 0; i < count; i++) {
      const seed = globalIdx * 7 + 13;
      const firstIdx = Math.floor(rng(seed) * FIRST_NAMES.length);
      const lastIdx  = Math.floor(rng(seed + 1) * LAST_NAMES.length);
      const deptIdx  = Math.floor(rng(seed + 2) * DEPARTMENTS.length);
      const dept     = DEPARTMENTS[deptIdx];
      const roleList = ROLES[dept] ?? ['Staff'];
      const roleIdx  = Math.floor(rng(seed + 3) * roleList.length);
      const photoIdx = Math.floor(rng(seed + 4) * PHOTOS.length);
      const apIdx    = Math.floor(rng(seed + 5) * plantSubAps.length);
      const ap       = plantSubAps[apIdx];

      // Status distribution: ~80% SAFE, ~8% MISSING, ~12% PENDING during emergency
      const statusRand = rng(seed + 6);
      const status: 'SAFE' | 'MISSING' | 'PENDING' =
        statusRand < 0.78 ? 'SAFE' :
        statusRand < 0.88 ? 'MISSING' : 'PENDING';

      const riskRand = rng(seed + 7);
      const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        riskRand < 0.65 ? 'LOW' : riskRand < 0.88 ? 'MEDIUM' : 'HIGH';

      const badgePrefix = plant.id.replace(/-/g, '').substring(0, 2).toUpperCase();
      const badge = `${badgePrefix}-${String(i + 1).padStart(4, '0')}`;

      const minSeen = Math.floor(rng(seed + 8) * 20) + 1;
      const lastSeen = status === 'SAFE' ? `${Math.floor(rng(seed+9)*5)+1} min ago` : `${minSeen} min ago`;

      const arrMin = 30 + Math.floor(rng(seed + 10) * 20);
      const arrivalTime = status === 'SAFE' ? `14:${arrMin}` : null;

      const locX = 5 + Math.floor(rng(seed + 11) * 90);
      const locY = 15 + Math.floor(rng(seed + 12) * 70);
      const tgtX = ap.x + Math.floor(rng(seed + 13) * 8) - 4;
      const tgtY = ap.y + Math.floor(rng(seed + 14) * 8) - 4;

      const timeline = [
        { time: '14:30', event: 'Emergency alert received via SMS + PA', type: 'warn' as const },
        ...(status === 'SAFE' ? [{ time: arrivalTime!, event: `Badge scanned at ${ap.id} ✓`, type: 'success' as const }] : []),
        ...(status === 'MISSING' && rng(seed+15) > 0.5 ? [{ time: `14:${30 + Math.floor(rng(seed+16)*10)}`, event: `Last badge scan — Zone ${plant.id}-${String.fromCharCode(65+Math.floor(rng(seed+17)*5))}`, type: 'info' as const }] : []),
      ];

      employees.push({
        id: `${plant.id}-${String(i + 1).padStart(4, '0')}`,
        name: `${FIRST_NAMES[firstIdx]} ${LAST_NAMES[lastIdx]}`,
        badge,
        department: dept,
        role: roleList[roleIdx],
        plant: plant.id as PlantId,
        assemblyPoint: ap.id,
        status,
        lastSeen,
        photo: PHOTOS[photoIdx],
        phone: `+91 ${Math.floor(rng(seed+18)*90+10)} ${Math.floor(rng(seed+19)*90000+10000)}`,
        arrivalTime,
        riskLevel,
        location: { x: locX, y: locY },
        targetLocation: { x: tgtX, y: tgtY },
        timeline,
      });

      globalIdx++;
    }
  }
  return employees;
}

export const GENERATED_EMPLOYEES = generateEmployees();
export const ALL_AP_DEFS = AP_DEFS;
