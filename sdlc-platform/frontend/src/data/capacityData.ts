// Team capacity planning mock data

export interface ProjectAllocation {
  id: number;
  name: string;
  allocation: number;
  critical?: boolean;
}

export interface WeeklyForecast {
  week: string;
  capacity: number;
}

export interface TeamMemberCapacity {
  id: number;
  name: string;
  role: string;
  avatar: string;
  department: string;
  projects: ProjectAllocation[];
  forecast: WeeklyForecast[];
}

export interface CriticalPathTask {
  task: string;
  assignee: string;
  endDate: string;
}

export interface ProjectCapacity {
  id: number;
  name: string;
  critical: boolean;
  totalAllocation: number;
  teamMembers: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  progress: number;
  criticalPath: CriticalPathTask[];
}

export const teamMembersCapacity: TeamMemberCapacity[] = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Project Manager',
    avatar: 'JS',
    department: 'Management',
    projects: [
      { id: 1, name: 'Digital Transformation', allocation: 40, critical: true },
      { id: 2, name: 'Customer Portal', allocation: 30 },
      { id: 3, name: 'Legacy Migration', allocation: 15 }
    ],
    forecast: [
      { week: 'W1', capacity: 90 },
      { week: 'W2', capacity: 100 },
      { week: 'W3', capacity: 85 },
      { week: 'W4', capacity: 80 },
      { week: 'W5', capacity: 70 },
      { week: 'W6', capacity: 65 }
    ]
  },
  {
    id: 2,
    name: 'Emily Johnson',
    role: 'Lead Developer',
    avatar: 'EJ',
    department: 'Engineering',
    projects: [
      { id: 1, name: 'Digital Transformation', allocation: 70, critical: true },
      { id: 4, name: 'API Gateway', allocation: 50, critical: true }
    ],
    forecast: [
      { week: 'W1', capacity: 110 },
      { week: 'W2', capacity: 120 },
      { week: 'W3', capacity: 130 },
      { week: 'W4', capacity: 110 },
      { week: 'W5', capacity: 90 },
      { week: 'W6', capacity: 80 }
    ]
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'QA Engineer',
    avatar: 'MC',
    department: 'Quality Assurance',
    projects: [
      { id: 1, name: 'Digital Transformation', allocation: 40 },
      { id: 5, name: 'Mobile App', allocation: 55, critical: true }
    ],
    forecast: [
      { week: 'W1', capacity: 80 },
      { week: 'W2', capacity: 85 },
      { week: 'W3', capacity: 95 },
      { week: 'W4', capacity: 100 },
      { week: 'W5', capacity: 110 },
      { week: 'W6', capacity: 105 }
    ]
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'UX Designer',
    avatar: 'SW',
    department: 'Design',
    projects: [
      { id: 1, name: 'Digital Transformation', allocation: 35 },
      { id: 6, name: 'Design System', allocation: 45, critical: true },
      { id: 2, name: 'Customer Portal', allocation: 20 }
    ],
    forecast: [
      { week: 'W1', capacity: 95 },
      { week: 'W2', capacity: 100 },
      { week: 'W3', capacity: 100 },
      { week: 'W4', capacity: 95 },
      { week: 'W5', capacity: 90 },
      { week: 'W6', capacity: 85 }
    ]
  },
  {
    id: 5,
    name: 'Robert Davis',
    role: 'DevOps Engineer',
    avatar: 'RD',
    department: 'Operations',
    projects: [
      { id: 7, name: 'Infrastructure Modernization', allocation: 65, critical: true },
      { id: 1, name: 'Digital Transformation', allocation: 45 }
    ],
    forecast: [
      { week: 'W1', capacity: 105 },
      { week: 'W2', capacity: 110 },
      { week: 'W3', capacity: 115 },
      { week: 'W4', capacity: 105 },
      { week: 'W5', capacity: 95 },
      { week: 'W6', capacity: 90 }
    ]
  },
  {
    id: 6,
    name: 'Lisa Martinez',
    role: 'Business Analyst',
    avatar: 'LM',
    department: 'Business',
    projects: [
      { id: 1, name: 'Digital Transformation', allocation: 50 },
      { id: 8, name: 'Process Improvement', allocation: 30 }
    ],
    forecast: [
      { week: 'W1', capacity: 80 },
      { week: 'W2', capacity: 85 },
      { week: 'W3', capacity: 80 },
      { week: 'W4', capacity: 75 },
      { week: 'W5', capacity: 70 },
      { week: 'W6', capacity: 75 }
    ]
  }
];

export const projectsCapacity: ProjectCapacity[] = [
  { 
    id: 1, 
    name: 'Digital Transformation', 
    critical: true,
    totalAllocation: 280,
    teamMembers: 6,
    riskLevel: 'High',
    progress: 42,
    criticalPath: [
      { task: 'Backend API Development', assignee: 'Emily Johnson', endDate: '2025-12-20' },
      { task: 'Infrastructure Setup', assignee: 'Robert Davis', endDate: '2025-12-15' }
    ]
  },
  { 
    id: 2, 
    name: 'Customer Portal', 
    critical: false,
    totalAllocation: 50,
    teamMembers: 2,
    riskLevel: 'Low',
    progress: 65,
    criticalPath: []
  },
  { 
    id: 3, 
    name: 'Legacy Migration', 
    critical: false,
    totalAllocation: 15,
    teamMembers: 1,
    riskLevel: 'Medium',
    progress: 30,
    criticalPath: []
  },
  { 
    id: 4, 
    name: 'API Gateway', 
    critical: true,
    totalAllocation: 50,
    teamMembers: 1,
    riskLevel: 'High',
    progress: 25,
    criticalPath: [
      { task: 'Security Implementation', assignee: 'Emily Johnson', endDate: '2025-12-18' }
    ]
  },
  { 
    id: 5, 
    name: 'Mobile App', 
    critical: true,
    totalAllocation: 55,
    teamMembers: 1,
    riskLevel: 'Medium',
    progress: 35,
    criticalPath: [
      { task: 'Integration Testing', assignee: 'Michael Chen', endDate: '2025-12-22' }
    ]
  },
  { 
    id: 6, 
    name: 'Design System', 
    critical: true,
    totalAllocation: 45,
    teamMembers: 1,
    riskLevel: 'Low',
    progress: 50,
    criticalPath: [
      { task: 'Component Library', assignee: 'Sarah Williams', endDate: '2025-12-17' }
    ]
  },
  { 
    id: 7, 
    name: 'Infrastructure Modernization', 
    critical: true,
    totalAllocation: 65,
    teamMembers: 1,
    riskLevel: 'High',
    progress: 20,
    criticalPath: [
      { task: 'Kubernetes Deployment', assignee: 'Robert Davis', endDate: '2025-12-19' }
    ]
  },
  { 
    id: 8, 
    name: 'Process Improvement', 
    critical: false,
    totalAllocation: 30,
    teamMembers: 1,
    riskLevel: 'Low',
    progress: 55,
    criticalPath: []
  }
];

export const departments = ['All', 'Engineering', 'Management', 'Quality Assurance', 'Design', 'Operations', 'Business'];

export const getAvatarColor = (name: string): string => {
  const colors = [
    '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#c2185b',
    '#00796b', '#e64a19', '#5d4037', '#455a64', '#0288d1'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return colors[hash % colors.length];
};

export const calculateTotalAllocation = (projects: ProjectAllocation[]): number => {
  return projects.reduce((sum, proj) => sum + proj.allocation, 0);
};

export const getCapacityColor = (capacity: number): 'error' | 'warning' | 'success' => {
  if (capacity > 100) return 'error';
  if (capacity > 90) return 'warning';
  return 'success';
};
