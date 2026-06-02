export type RequestStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Employee'
  | 'Resolved'
  | 'Escalated'
  | 'Closed';

export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type RequestCategory =
  | 'IT Support'
  | 'HR Support'
  | 'Facilities'
  | 'Travel'
  | 'Office Access'
  | 'Equipment'
  | 'Onboarding'
  | 'Pantry / Supplies';

export interface RequestComment {
  id: string;
  requestId: string;
  authorId: string;
  message: string;
  createdAt: string;
  internal: boolean;
}

export interface RequestAudit {
  id: string;
  requestId: string;
  actorId: string;
  action: string;
  timestamp: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: RequestCategory;
  priority: RequestPriority;
  department: string;
  description: string;
  status: RequestStatus;
  requesterId: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  comments: RequestComment[];
  auditLog: RequestAudit[];
}
