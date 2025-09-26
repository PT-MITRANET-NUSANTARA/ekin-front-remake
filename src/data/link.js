import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { DashboardOutlined, DatabaseOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  }
];

/**
 * @type {{
 *  label: string;
 *  permissions: [Action, import('@/models/Model').ModelChildren][];
 *  roles: Role[];
 *  children: {
 *   path: string;
 *   label: string;
 *   icon: import('react').ReactNode;
 *   element: import('react').ReactNode;
 *   roles?: Role[];
 *   permissions?: [Action, import('@/models/Model').ModelChildren][];
 *  }[];
 * }[]}
 */
export const dashboardLink = [
  {
    label: 'Overview',
    icon: DashboardOutlined,
    children: [{ path: '/dashboard', label: 'Dashboard', element: Dashboard.Dashboard }]
  },
  {
    label: 'Management Data',
    icon: DatabaseOutlined,
    children: [
      { path: '/dashboard/visions', label: 'Visi', element: Dashboard.Visions },
      { path: '/dashboard/missions', label: 'Misi', element: Dashboard.Missions },
      { path: '/dashboard/renstras', label: 'Rencana Strategi', element: Dashboard.Renstras },
      { path: '/dashboard/goals', label: 'Tujuan', element: Dashboard.Goals },
      { path: '/dashboard/programs', label: 'Program', element: Dashboard.Programs },
      { path: '/dashboard/activities', label: 'Kegiatan', element: Dashboard.Activities },
      { path: '/dashboard/subactivities', label: 'Sub Kegiatan', element: Dashboard.SubActivities },
      { path: '/dashboard/rkts', label: 'RKT', element: Dashboard.Rkts },
      { path: '/dashboard/assessmentperiod', label: 'Periode Penilaian', element: Dashboard.AssessmentPeriod },
      { path: '/dashboard/skps', label: 'SKP', element: Dashboard.Skps }
    ]
  }
].map((item) => ({
  ...item,
  permissions: item.children.flatMap((child) => child.permissions).filter((permission) => permission),
  roles: item.children.flatMap((child) => child.roles).filter((role) => role)
}));

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
