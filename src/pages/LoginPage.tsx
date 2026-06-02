import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { loginDemo } from '../services/authService';
import { setUser, setLoading, setError } from '../features/auth/authSlice';
import { Button } from '../components/common/Button';

const roles = [
  { label: 'Employee Demo', role: 'employee' },
  { label: 'Admin Demo', role: 'admin' },
  { label: 'Manager Demo', role: 'manager' }
] as const;

export function LoginPage() {
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (role: 'employee' | 'admin' | 'manager') => {
    setErrorMessage(null);
    setLoadingState(true);

    try {
      dispatch(setLoading());
      const user = await loginDemo(role);
      dispatch(setUser(user));
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage('Could not sign in. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/95 p-10 shadow-soft">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <span className="inline-flex rounded-full bg-indigo-500/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-200">WorkNest</span>
          <h1 className="text-4xl font-semibold">Corporate service management</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-400">Access demo workflows for employee service requests, admin operations, and manager analytics.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((item) => (
            <Button key={item.role} onClick={() => handleLogin(item.role)} disabled={loading}>
              {loading ? 'Loading...' : item.label}
            </Button>
          ))}
        </div>
        {error ? <div className="mt-6 rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}
      </div>
    </div>
  );
}
