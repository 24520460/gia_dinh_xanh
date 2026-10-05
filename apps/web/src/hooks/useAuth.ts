import { useState } from 'react';
import { IUser, UserRole } from '@gdx/shared-types';

export function useAuth() {
  const [user, setUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<UserRole>('customer');

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  return {
    user,
    role,
    setUser,
    switchRole,
    isAuthenticated: Boolean(user),
  };
}
