import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { isRoleAuthorized } from '../services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: 'admin' | 'manager' | 'employee' | 'any';
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isRoleAuthorized(user.role, allowedRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
