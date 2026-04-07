import { Role } from '@/constants';
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
        element: Dashboard.Dashboard
      }
    ]
  },
  {
    label: 'Master Data',
    icon: DatabaseOutlined,
    roles: [Role.ADMIN],
    children: [
      {
        path: '/dashboard/visions',
        label: 'Visi',
        element: Dashboard.Visions
      },
      {
        path: '/dashboard/missions',
        label: 'Misi',
        element: Dashboard.Missions
      }
    ]
  },
  {
    label: 'Renstra',
    icon: CheckSquareOutlined,
    children: [
      {
        path: '/dashboard/renstras',
        label: 'Sinkronasi',
        element: Dashboard.Renstras
      },
      {
        path: '/dashboard/goals',
        label: 'Tujuan',
        element: Dashboard.Goals
      },
      {
        path: '/dashboard/programs',
        label: 'Program',
        element: Dashboard.Programs
      },
      {
        path: '/dashboard/activities',
        label: 'Kegiatan',
        element: Dashboard.Activities
      },
      {
        path: '/dashboard/subactivities',
        label: 'Sub Kegiatan',
        element: Dashboard.SubActivities
      }
    ]
  },
  {
    label: 'Rencana Kerja Tahunan',
    icon: ClusterOutlined,
    children: [
      { path: '/dashboard/rkts', label: 'RKT', element: Dashboard.Rkts, permissions: ['manage_rkts'] },
      { path: '/dashboard/assessment_periods', label: 'Periode Penilaian', element: Dashboard.AssessmentPeriod },
      { label: 'Perjanjian Kinerja', path: '/dashboard/perjanjian_kinerja', element: Dashboard.PerjanjianKinerjas }
    ]
  },

  {
    label: 'SKP',
    icon: FileProtectOutlined,
    path: '/dashboard/skps',
    element: Dashboard.Skps
  },
  {
    label: 'Umpeg',
    icon: UsergroupAddOutlined,
    path: '/dashboard/umpegs',
    element: Dashboard.Umpegs
  },
  {
    label: 'Verificator',
    icon: UsergroupAddOutlined,
    path: '/dashboard/varificator',
    element: Dashboard.Verificators
  },
  {
    label: 'Web Settings',
    icon: SettingOutlined,
    path: '/dashboard/web_settings',
    element: Dashboard.WebSettings
  },
  {
    label: 'Verifikasi',
    icon: CheckCircleOutlined,
    path: '/dashboard/verificate_perjanjian_kinerja',
    element: Dashboard.VerificatePerjanjianKinerjas
  },
  {
    label: 'Kegiatan Harian',
    icon: CalendarOutlined,
    path: '/dashboard/harian',
    element: Dashboard.Daily
  },
  {
    label: 'Absensi',
    icon: ScheduleOutlined,
    path: '/dashboard/absence',
    element: Dashboard.Absence
  },
  {
    label: 'Kalender',
    icon: CalendarOutlined,
    path: '/dashboard/calendar',
    element: Dashboard.Calendars
  },
  {
    label: 'Request Sample 2',
    icon: DatabaseOutlined,
    path: '/dashboard/harians',
    element: Dashboard.Harians
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
