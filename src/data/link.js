import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { CheckSquareOutlined, DashboardOutlined, DatabaseOutlined, FileProtectOutlined } from '@ant-design/icons';

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
    label: 'Master Data',
    icon: DatabaseOutlined,
    children: [
      { path: '/dashboard/visions', label: 'Visi', element: Dashboard.Visions },
      { path: '/dashboard/missions', label: 'Misi', element: Dashboard.Missions }
    ]
  },
  {
    label: 'Rencana Kerja',
    icon: CheckSquareOutlined,
    children: [
      { path: '/dashboard/renstras', label: 'Rencana Strategi', element: Dashboard.Renstras },
      { path: '/dashboard/goals', label: 'Tujuan', element: Dashboard.Goals },
      { path: '/dashboard/programs', label: 'Program', element: Dashboard.Programs },
      { path: '/dashboard/activities', label: 'Kegiatan', element: Dashboard.Activities },
      { path: '/dashboard/subactivities', label: 'Sub Kegiatan', element: Dashboard.SubActivities }
    ]
  },
  {
    label: 'Rencana Kerja Tahunan',
    icon: FileProtectOutlined,
    children: [
      { path: '/dashboard/rkts', label: 'RKT', element: Dashboard.Rkts },
      { path: '/dashboard/assessmentperiod', label: 'Periode Penilaian', element: Dashboard.AssessmentPeriod }
    ]
  },
  {
    label: 'SKP',
    icon: FileProtectOutlined,
    path: '/dashboard/skps',
    element: Dashboard.Skps
  },
  {
    label: 'Absensi',
    icon: FileProtectOutlined,
    path: '/dashboard/absence',
    element: Dashboard.Absence
  }
].map((item) => {
  if (item.children) {
    return {
      ...item,
      permissions: item.children.flatMap((child) => child.permissions || []).filter(Boolean),
      roles: item.children.flatMap((child) => child.roles || []).filter(Boolean)
    };
  }

  return {
    ...item,
    permissions: item.permissions || [],
    roles: item.roles || []
  };
});

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
