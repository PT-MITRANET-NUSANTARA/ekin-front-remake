import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!token) return;

    if (redirect && !redirect.includes('/auth')) {
      navigate(redirect);
    } else {
      navigate('/dashboard');
    }
  }, [navigate, redirect, token]);

  return (
    <div className="w-full bg-slate-50 font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center px-4 py-12">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
