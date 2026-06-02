import { describe, expect, it } from 'vitest';
import { isRoleAuthorized } from '../services/authService';

describe('Auth role helper', () => {
  it('allows admins to access admin routes', () => {
    expect(isRoleAuthorized('admin', 'admin')).toBe(true);
  });

  it('prevents employees from accessing manager routes', () => {
    expect(isRoleAuthorized('employee', 'manager')).toBe(false);
  });

  it('allows any authenticated user to see any route with any permission', () => {
    expect(isRoleAuthorized('employee', 'any')).toBe(true);
    expect(isRoleAuthorized('admin', 'any')).toBe(true);
  });
});
