import { loadMockDb, mockDelay } from './mockDb';
import { User, UserRole } from '../types/user.types';

export function isRoleAuthorized(userRole: UserRole, routeRole: 'admin' | 'manager' | 'employee' | 'any') {
  if (routeRole === 'any') {
    return Boolean(userRole);
  }
  if (routeRole === 'employee') {
    return userRole === 'employee' || userRole === 'admin' || userRole === 'manager';
  }
  return userRole === routeRole;
}

export async function loginDemo(role: UserRole): Promise<User> {
  await mockDelay(400);
  const db = loadMockDb();
  const user = db.users.find((entry) => entry.role === role);
  if (!user) {
    throw new Error('Demo user not found');
  }
  return user;
}

export async function fetchUserById(userId: string) {
  await mockDelay(200);
  const db = loadMockDb();
  return db.users.find((user) => user.id === userId);
}
