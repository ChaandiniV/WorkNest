import { loadMockDb, saveMockDb, mockDelay } from './mockDb';
import { ServiceRequest, RequestComment, RequestAudit, RequestStatus } from '../types/request.types';
import { getSlaDeadline } from '../utils/calculateSLA';

const randomId = () => `id-${Math.random().toString(36).slice(2, 10)}`;

export async function fetchRequests(): Promise<ServiceRequest[]> {
  await mockDelay(550);
  const db = loadMockDb();
  return db.requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function fetchRequestById(requestId: string): Promise<ServiceRequest | undefined> {
  await mockDelay(300);
  const db = loadMockDb();
  return db.requests.find((request) => request.id === requestId);
}

function saveRequestList(requests: ServiceRequest[]) {
  const db = loadMockDb();
  saveMockDb({ ...db, requests });
}

export async function createRequest(payload: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'slaDeadline' | 'comments' | 'auditLog' | 'status'> & { status?: RequestStatus }): Promise<ServiceRequest> {
  await mockDelay(500);
  const db = loadMockDb();
  const now = new Date().toISOString();
  const request: ServiceRequest = {
    id: `req-${Math.floor(Math.random() * 1000000)}`,
    title: payload.title,
    category: payload.category,
    priority: payload.priority,
    department: payload.department,
    description: payload.description,
    status: payload.status ?? 'Open',
    requesterId: payload.requesterId,
    assignedToId: payload.assignedToId,
    createdAt: now,
    updatedAt: now,
    slaDeadline: getSlaDeadline(now, payload.priority),
    comments: [],
    auditLog: [
      {
        id: randomId(),
        requestId: '',
        actorId: payload.requesterId,
        action: 'Request created',
        timestamp: now
      }
    ]
  };
  request.auditLog[0].requestId = request.id;
  const requests = [request, ...db.requests];
  saveRequestList(requests);
  return request;
}

export async function updateRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
  await mockDelay(450);
  const db = loadMockDb();
  const requests = db.requests.map((request) => {
    if (request.id !== requestId) {
      return request;
    }
    return {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  });
  saveRequestList(requests);
  return requests.find((request) => request.id === requestId) as ServiceRequest;
}

export async function addRequestComment(requestId: string, authorId: string, message: string, internal = false): Promise<RequestComment> {
  await mockDelay(350);
  const db = loadMockDb();
  const now = new Date().toISOString();
  const comment: RequestComment = {
    id: randomId(),
    requestId,
    authorId,
    message,
    internal,
    createdAt: now
  };
  const requests = db.requests.map((request) => {
    if (request.id !== requestId) return request;
    return { ...request, comments: [...request.comments, comment], updatedAt: now };
  });
  saveRequestList(requests);
  return comment;
}

export async function addRequestAudit(requestId: string, actorId: string, action: string): Promise<RequestAudit> {
  await mockDelay(250);
  const db = loadMockDb();
  const audit: RequestAudit = {
    id: randomId(),
    requestId,
    actorId,
    action,
    timestamp: new Date().toISOString()
  };
  const requests = db.requests.map((request) => {
    if (request.id !== requestId) return request;
    return { ...request, auditLog: [...request.auditLog, audit], updatedAt: audit.timestamp };
  });
  saveRequestList(requests);
  return audit;
}

export async function assignRequest(requestId: string, agentId: string): Promise<ServiceRequest> {
  await addRequestAudit(requestId, agentId, `Assigned to ${agentId}`);
  return updateRequest(requestId, { assignedToId: agentId, status: 'Assigned' as RequestStatus });
}

export async function changeRequestStatus(requestId: string, status: RequestStatus, actorId: string): Promise<ServiceRequest> {
  await addRequestAudit(requestId, actorId, `Status changed to ${status}`);
  return updateRequest(requestId, { status });
}

export async function resolveRequest(requestId: string, actorId: string): Promise<ServiceRequest> {
  await addRequestAudit(requestId, actorId, 'Marked as resolved');
  return updateRequest(requestId, { status: 'Resolved' as RequestStatus });
}
