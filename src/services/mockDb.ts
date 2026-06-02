import { addHours, subHours, subDays } from 'date-fns';
import { RequestAudit, RequestComment, ServiceRequest } from '../types/request.types';
import { User, UserProfile, UserRole } from '../types/user.types';
import { getSlaDeadline } from '../utils/calculateSLA';

const STORAGE_KEY = 'worknest.local.db';

const createId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

const buildComment = (requestId: string, authorId: string, message: string, internal = false, offsetHours = 0): RequestComment => ({
  id: `${requestId}-comment-${Math.random().toString(36).slice(2, 8)}`,
  requestId,
  authorId,
  message,
  internal,
  createdAt: addHours(new Date(), offsetHours).toISOString()
});

const buildAudit = (requestId: string, actorId: string, action: string, offsetHours = 0): RequestAudit => ({
  id: `${requestId}-audit-${Math.random().toString(36).slice(2, 8)}`,
  requestId,
  actorId,
  action,
  timestamp: addHours(new Date(), offsetHours).toISOString()
});

const users: User[] = [
  { id: 'user-employee', name: 'Ava Ramirez', email: 'ava.ramirez@worknest.com', role: 'employee', department: 'Finance', avatar: 'AR' },
  { id: 'user-admin', name: 'Marcus Chen', email: 'marcus.chen@worknest.com', role: 'admin', department: 'Operations', avatar: 'MC' },
  { id: 'user-manager', name: 'Priya Singh', email: 'priya.singh@worknest.com', role: 'manager', department: 'Human Resources', avatar: 'PS' },
  { id: 'agent-it', name: 'Derek Holt', email: 'derek.holt@worknest.com', role: 'agent', department: 'IT', avatar: 'DH' },
  { id: 'agent-hr', name: 'Chloe Park', email: 'chloe.park@worknest.com', role: 'agent', department: 'HR', avatar: 'CP' },
  { id: 'agent-facilities', name: 'Lena Ortiz', email: 'lena.ortiz@worknest.com', role: 'agent', department: 'Facilities', avatar: 'LO' },
  { id: 'agent-travel', name: 'Noah Patel', email: 'noah.patel@worknest.com', role: 'agent', department: 'Travel', avatar: 'NP' },
  { id: 'agent-support', name: 'Maya Brooks', email: 'maya.brooks@worknest.com', role: 'agent', department: 'Office Services', avatar: 'MB' }
];

const requestSeeds = [
  {
    title: 'Laptop VPN access request',
    category: 'IT Support',
    priority: 'High',
    department: 'Finance',
    description: 'Need VPN access for secure remote connectivity to financial systems.',
    status: 'Assigned',
    assignedToId: 'agent-it',
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-1', 'agent-it', 'VPN access request received. Reviewing account entitlement.', false, -20)
    ],
    auditLog: [
      buildAudit('req-1', 'agent-it', 'Assigned to Derek Holt', -20)
    ]
  },
  {
    title: 'New hire onboarding equipment',
    category: 'Onboarding',
    priority: 'Medium',
    department: 'Human Resources',
    description: 'Requesting laptop, monitor, and access cards for new team member starting next week.',
    status: 'In Progress',
    assignedToId: 'agent-support',
    createdAt: subDays(new Date(), 4).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-manager',
    comments: [
      buildComment('req-2', 'agent-support', 'Preparing equipment list and coordinating with Procurement.', false, -35)
    ],
    auditLog: [
      buildAudit('req-2', 'agent-support', 'Work started on onboarding package', -35)
    ]
  },
  {
    title: 'Office AC temperature too low',
    category: 'Facilities',
    priority: 'Low',
    department: 'Marketing',
    description: 'The conference room AC is too cold during afternoon sessions.',
    status: 'Open',
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-employee',
    comments: [],
    auditLog: []
  },
  {
    title: 'Expense report approval delay',
    category: 'HR Support',
    priority: 'Critical',
    department: 'Finance',
    description: 'Urgent approval needed for travel reimbursement before month end.',
    status: 'Waiting for Employee',
    assignedToId: 'agent-hr',
    createdAt: subHours(new Date(), -10).toISOString(),
    updatedAt: subHours(new Date(), -6).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-4', 'agent-hr', 'Please provide the missing receipt details.', false, -9)
    ],
    auditLog: [
      buildAudit('req-4', 'agent-hr', 'Status changed to Waiting for Employee', -9)
    ]
  },
  {
    title: 'Access badge not working',
    category: 'Office Access',
    priority: 'High',
    department: 'Operations',
    description: 'Badge door access fails at the 7th floor entrance.',
    status: 'Escalated',
    assignedToId: 'agent-facilities',
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-5', 'agent-facilities', 'Escalated building systems team for a security review.', true, -40)
    ],
    auditLog: [
      buildAudit('req-5', 'agent-facilities', 'Escalated issue to Facilities lead', -40)
    ]
  },
  {
    title: 'Payroll system login problem',
    category: 'IT Support',
    priority: 'Critical',
    department: 'Human Resources',
    description: 'Unable to access payroll portal when using Google SSO.',
    status: 'Open',
    createdAt: subHours(new Date(), -5).toISOString(),
    updatedAt: subHours(new Date(), -4).toISOString(),
    requesterId: 'user-manager',
    comments: [],
    auditLog: []
  },
  {
    title: 'Team lunch order delay',
    category: 'Pantry / Supplies',
    priority: 'Low',
    department: 'Engineering',
    description: 'Pantry delivery for the 2pm team lunch has not arrived.',
    status: 'Resolved',
    assignedToId: 'agent-support',
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-7', 'agent-support', 'Vendor delivery retried and completed. Order delivered.', false, -20)
    ],
    auditLog: [
      buildAudit('req-7', 'agent-support', 'Marked resolved after pantry vendor delivery', -20)
    ]
  },
  {
    title: 'Travel policy question',
    category: 'Travel',
    priority: 'Medium',
    department: 'Sales',
    description: 'Requesting clarification on travel expense limits for client visits.',
    status: 'Assigned',
    assignedToId: 'agent-travel',
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-8', 'agent-travel', 'Reviewing policy and responding with company guidance.', false, -38)
    ],
    auditLog: [
      buildAudit('req-8', 'agent-travel', 'Assigned to travel advisor', -38)
    ]
  },
  {
    title: 'Conference room reservation conflict',
    category: 'Facilities',
    priority: 'Medium',
    department: 'Operations',
    description: 'Two teams booked the same conference room for a board meeting.',
    status: 'In Progress',
    assignedToId: 'agent-facilities',
    createdAt: subDays(new Date(), 6).toISOString(),
    updatedAt: subDays(new Date(), 4).toISOString(),
    requesterId: 'user-manager',
    comments: [
      buildComment('req-9', 'agent-facilities', 'Coordinating schedule and providing an alternate room.', false, -90)
    ],
    auditLog: [
      buildAudit('req-9', 'agent-facilities', 'Room conflict resolved with alternate booking', -90)
    ]
  },
  {
    title: 'Ergonomic keyboard request',
    category: 'Equipment',
    priority: 'Low',
    department: 'Design',
    description: 'Need an ergonomic keyboard for daily design work.',
    status: 'Open',
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-employee',
    comments: [],
    auditLog: []
  },
  {
    title: 'Software license renewal',
    category: 'IT Support',
    priority: 'High',
    department: 'Product',
    description: 'Renew shared design tool license before next sprint planning.',
    status: 'Assigned',
    assignedToId: 'agent-it',
    createdAt: subDays(new Date(), 8).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
    requesterId: 'user-manager',
    comments: [
      buildComment('req-11', 'agent-it', 'Contacted vendor and verified renewal window.', false, -70)
    ],
    auditLog: [
      buildAudit('req-11', 'agent-it', 'Renewal workflow in progress', -70)
    ]
  },
  {
    title: 'Account access to CRM system',
    category: 'IT Support',
    priority: 'Critical',
    department: 'Sales',
    description: 'Sales rep cannot access CRM while client presentation is starting.',
    status: 'In Progress',
    assignedToId: 'agent-it',
    createdAt: subHours(new Date(), -15).toISOString(),
    updatedAt: subHours(new Date(), -6).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-12', 'agent-it', 'Escalated to system admin due to authentication failure.', true, -12)
    ],
    auditLog: [
      buildAudit('req-12', 'agent-it', 'Escalated to IT admin for CRM auth', -12)
    ]
  },
  {
    title: 'Review meeting video conferencing',
    category: 'Office Access',
    priority: 'Medium',
    department: 'Engineering',
    description: 'Meeting room video system is not connecting to remote attendees.',
    status: 'Resolved',
    assignedToId: 'agent-facilities',
    createdAt: subDays(new Date(), 7).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-13', 'agent-facilities', 'AV team replaced cables and verified the meeting setup.', false, -30)
    ],
    auditLog: [
      buildAudit('req-13', 'agent-facilities', 'Marked resolved after AV fix', -30)
    ]
  },
  {
    title: 'Birthday celebration supplies',
    category: 'Pantry / Supplies',
    priority: 'Low',
    department: 'People Ops',
    description: 'Order balloons and refreshments for Friday office celebration.',
    status: 'Assigned',
    assignedToId: 'agent-support',
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-manager',
    comments: [
      buildComment('req-14', 'agent-support', 'Vendor order confirmed for delivery.', false, -18)
    ],
    auditLog: [
      buildAudit('req-14', 'agent-support', 'Created purchase request for celebration', -18)
    ]
  },
  {
    title: 'Biometrics door badge renewal',
    category: 'Office Access',
    priority: 'High',
    department: 'Security',
    description: 'Need badge renewal for several long-term contractors.',
    status: 'Escalated',
    assignedToId: 'agent-facilities',
    createdAt: subDays(new Date(), 4).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-admin',
    comments: [
      buildComment('req-15', 'agent-facilities', 'Escalated to security operations for verification.', true, -40)
    ],
    auditLog: [
      buildAudit('req-15', 'agent-facilities', 'Escalated security badge renewal', -40)
    ]
  },
  {
    title: 'Recruitment event logistics',
    category: 'Travel',
    priority: 'Medium',
    department: 'Human Resources',
    description: 'Arrange travel and hotel for the recruiting event in two weeks.',
    status: 'Open',
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    requesterId: 'user-manager',
    comments: [],
    auditLog: []
  },
  {
    title: 'Meeting room whiteboard repair',
    category: 'Facilities',
    priority: 'Low',
    department: 'Product',
    description: 'Whiteboard surface in conference room B is damaged and hard to write on.',
    status: 'Resolved',
    assignedToId: 'agent-facilities',
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-17', 'agent-facilities', 'Replaced the board and confirmed operation.', false, -120)
    ],
    auditLog: [
      buildAudit('req-17', 'agent-facilities', 'Closed after whiteboard replacement', -120)
    ]
  },
  {
    title: 'Password reset for HR portal',
    category: 'HR Support',
    priority: 'High',
    department: 'Human Resources',
    description: 'Employee cannot reset password for HR self-service portal.',
    status: 'In Progress',
    assignedToId: 'agent-hr',
    createdAt: subHours(new Date(), -14).toISOString(),
    updatedAt: subHours(new Date(), -6).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-18', 'agent-hr', 'Password reset token generated and shared.', false, -11)
    ],
    auditLog: [
      buildAudit('req-18', 'agent-hr', 'Password reset flow executed', -11)
    ]
  },
  {
    title: 'Desktop monitor replacement',
    category: 'Equipment',
    priority: 'Medium',
    department: 'Engineering',
    description: 'Primary monitor has dead pixels and needs replacement.',
    status: 'Assigned',
    assignedToId: 'agent-support',
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    requesterId: 'user-employee',
    comments: [
      buildComment('req-19', 'agent-support', 'Ordered replacement monitor from inventory.', false, -28)
    ],
    auditLog: [
      buildAudit('req-19', 'agent-support', 'Equipment replacement order placed', -28)
    ]
  },
  {
    title: 'Monthly facilities inspection request',
    category: 'Facilities',
    priority: 'Low',
    department: 'Operations',
    description: 'Schedule the regular inspection of office safety and infrastructure.',
    status: 'Open',
    createdAt: subDays(new Date(), 4).toISOString(),
    updatedAt: subDays(new Date(), 4).toISOString(),
    requesterId: 'user-admin',
    comments: [],
    auditLog: []
  }
];

const profile: UserProfile = {
  name: 'WorkNest Demo',
  email: 'demo@worknest.com',
  department: 'Corporate Services',
  notifications: true
};

const featureFlags = {
  devConsole: true,
  newAnalytics: true,
  darkMode: true
};

export interface MockDbState {
  users: User[];
  requests: ServiceRequest[];
  profile: UserProfile;
  featureFlags: Record<string, boolean>;
}

const createRequests = () =>
  requestSeeds.map((item, index) => {
    const requestId = `req-${index + 1}`;
    const createdAt = item.createdAt;
    const deadline = getSlaDeadline(createdAt, item.priority as any);
    return {
      id: requestId,
      title: item.title,
      category: item.category as any,
      priority: item.priority as any,
      department: item.department,
      description: item.description,
      status: item.status as any,
      requesterId: item.requesterId,
      assignedToId: item.assignedToId,
      createdAt,
      updatedAt: item.updatedAt,
      slaDeadline: deadline,
      comments: item.comments.map((comment) => ({ ...comment, requestId })),
      auditLog: item.auditLog.map((audit) => ({ ...audit, requestId }))
    } satisfies ServiceRequest;
  });

const seedState: MockDbState = {
  users,
  requests: createRequests(),
  profile,
  featureFlags
};

export function loadMockDb(): MockDbState {
  if (typeof window === 'undefined') {
    return seedState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return seedState;
  }

  try {
    return JSON.parse(stored) as MockDbState;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return seedState;
  }
}

export function saveMockDb(state: MockDbState) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLocalStorageStatus() {
  if (typeof window === 'undefined') {
    return { exists: false, size: 0 };
  }
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return { exists: Boolean(saved), size: saved?.length ?? 0 };
}

export function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
