import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { adminApi, setAdminCsrfToken } from '../lib/adminApi';
import type { AdminUser } from '../types/api';

type SessionState =
  | { status: 'checking'; user: null }
  | { status: 'anonymous'; user: null }
  | { status: 'authenticated'; user: AdminUser };

interface AdminSessionValue {
  session: SessionState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

// Holds the signed-in admin for the /admin area. Authentication itself is enforced by the server on every request.
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ status: 'checking', user: null });

  useEffect(() => {
    const controller = new AbortController();
    adminApi
      .me(controller.signal)
      .then(({ user, csrfToken }) => {
        setAdminCsrfToken(csrfToken);
        setSession({ status: 'authenticated', user });
      })
      .catch(() => {
        if (!controller.signal.aborted) setSession({ status: 'anonymous', user: null });
      });
    return () => controller.abort();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { user, csrfToken } = await adminApi.login(email, password);
    setAdminCsrfToken(csrfToken);
    setSession({ status: 'authenticated', user });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setAdminCsrfToken('');
      setSession({ status: 'anonymous', user: null });
    }
  }, []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionValue {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error('useAdminSession must be used inside AdminSessionProvider.');
  return value;
}
