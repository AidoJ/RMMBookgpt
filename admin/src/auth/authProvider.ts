import type { AuthBindings } from '@refinedev/core';
export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const res = await fetch('/.netlify/functions/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!res.ok) { const t = await res.text(); return { success: false, error: new Error(t || 'Login failed') }; }
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      return { success: true, redirectTo: '/admin' };
    } catch (e: any) { return { success: false, error: new Error(e?.message || 'Login failed') }; }
  },
  logout: async () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); return { success: true, redirectTo: '/admin/login' }; },
  onError: async () => ({}),
  check: async () => localStorage.getItem('admin_token') ? { authenticated: true } : { authenticated: false, redirectTo: '/admin/login' },
  getIdentity: async () => JSON.parse(localStorage.getItem('admin_user') || 'null'),
  getPermissions: async () => (JSON.parse(localStorage.getItem('admin_user') || 'null') || {}).role
};
