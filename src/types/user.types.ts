export type UserRole = 'employee' | 'admin' | 'manager' | 'agent';

export interface UserProfile {
  name: string;
  email: string;
  department: string;
  notifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}
