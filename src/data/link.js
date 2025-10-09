import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import { CalendarOutlined, CheckCircleOutlined, CheckSquareOutlined, ClusterOutlined, DashboardOutlined, DatabaseOutlined, FileProtectOutlined, ScheduleOutlined, SettingOutlined, UsergroupAddOutlined } from '@ant-design/icons';

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
    children: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        element: Dashboard.Dashboard,
        permissions: ['lihat_dashboard'] // ✅ ini publik
      }
    ]
  },
  {
    label: 'Master Data',
    icon: DatabaseOutlined,
    children: [
      {
        path: '/dashboard/visions',
        label: 'Visi',
        element: Dashboard.Visions,
        permissions: ['manage_visi']
      },
      {
        path: '/dashboard/missions',
        label: 'Misi',
        element: Dashboard.Missions,
        permissions: ['manage_misi']
      }
    ]
  },
  {
    label: 'Rencana Kerja',
    icon: CheckSquareOutlined,
    children: [
      {
        path: '/dashboard/renstras',
        label: 'Rencana Strategi',
        element: Dashboard.Renstras,
        permissions: ['manage_renstra']
      },
      {
        path: '/dashboard/goals',
        label: 'Tujuan',
        element: Dashboard.Goals,
        permissions: ['manage_renstra']
      },
      {
        path: '/dashboard/programs',
        label: 'Program',
        element: Dashboard.Programs,
        permissions: ['manage_renstra']
      },
      {
        path: '/dashboard/activities',
        label: 'Kegiatan',
        element: Dashboard.Activities,
        permissions: ['manage_kegiatan']
      },
      {
        path: '/dashboard/subactivities',
        label: 'Sub Kegiatan',
        element: Dashboard.SubActivities,
        permissions: ['manage_renstra']
      }
    ]
  },
  {
    label: 'Rencana Kerja Tahunan',
    icon: ClusterOutlined,
    children: [
      { path: '/dashboard/rkts', label: 'RKT', element: Dashboard.Rkts, permissions: ['manage_rkts'] },
      { path: '/dashboard/assessment_periods', label: 'Periode Penilaian', element: Dashboard.AssessmentPeriod, permissions: ['manage_assessment_period'] },
      { label: 'Perjanjian Kinerja', path: '/dashboard/perjanjian_kinerja', element: Dashboard.PerjanjianKinerjas, permissions: ['manage_perjanjian_kinerja'] },
      { label: 'Template Perjanjian Kinerja', path: '/dashboard/perjanjian-kinerja-template/:id', element: Dashboard.PerjanjianKinerjaTemplate, permissions: ['manage_skp'] }
    ]
  },
  {
    label: 'SKP',
    icon: FileProtectOutlined,
    path: '/dashboard/skps',
    element: Dashboard.Skps,
    permissions: ['manage_skp']
  },
  {
    label: 'Umpeg',
    icon: UsergroupAddOutlined,
    path: '/dashboard/umpegs',
    element: Dashboard.Umpegs,
    permissions: ['manage_umpegs']
  },
  {
    label: 'Verificator',
    icon: UsergroupAddOutlined,
    path: '/dashboard/varificator',
    element: Dashboard.Verificators,
    permissions: ['manage_verificator']
  },
  {
    label: 'Web Settings',
    icon: SettingOutlined,
    path: '/dashboard/web_settings',
    element: Dashboard.WebSettings,
    permissions: ['manage_settings']
  },
  {
    label: 'Verifikasi',
    icon: CheckCircleOutlined,
    path: '/dashboard/verificate_perjanjian_kinerja',
    element: Dashboard.VerificatePerjanjianKinerjas,
    permissions: ['manage_verificate']
  },
  {
    label: 'Kegiatan Harian',
    icon: CalendarOutlined,
    path: '/dashboard/harian',
    element: Dashboard.Harian,
    permissions: ['lihat_dashboard']
  },
  {
    label: 'Absensi',
    icon: ScheduleOutlined,
    path: '/dashboard/absence',
    element: Dashboard.Absence,
    permissions: ['lihat_dashboard']
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
