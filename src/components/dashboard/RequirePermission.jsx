/* eslint-disable react/prop-types */
import { useAuth } from '@/hooks';

const RequirePermission = ({ required = [], children }) => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  const isAllowed =
    required.length === 0 || // publik kalau tidak ada permission
    required.some(p => userPermissions.includes(p));

  if (!isAllowed) {
    // Bisa redirect ke dashboard atau render pesan
    return <div>⚠️ Anda tidak punya akses ke halaman ini</div>;
    // Atau kalau mau redirect otomatis:
    // return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequirePermission;
