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
    roles: [Role.ADMIN, Role.PIMPINAN, Role.UMPEG, Role.JPT, Role.ASN],
    children: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        element: Dashboard.Dashboard,
        roles: [Role.ADMIN, Role.PIMPINAN, Role.UMPEG, Role.JPT, Role.ASN]
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
        element: Dashboard.Visions,
        roles: [Role.ADMIN]
      },
      {
        path: '/dashboard/missions',
        label: 'Misi',
        element: Dashboard.Missions,
        roles: [Role.ADMIN]
      }
    ]
  },
  {
    label: 'Renstra',
    icon: CheckSquareOutlined,
    roles: [Role.ADMIN, Role.UMPEG],
    children: [
      {
        path: '/dashboard/renstras',
        label: 'Sinkronasi',
        element: Dashboard.Renstras,
        roles: [Role.ADMIN, Role.UMPEG]
      },
      {
        path: '/dashboard/goals',
        label: 'Tujuan',
        element: Dashboard.Goals,
        roles: [Role.ADMIN, Role.UMPEG]
      },
      {
        path: '/dashboard/programs',
        label: 'Program',
        element: Dashboard.Programs,
        roles: [Role.ADMIN, Role.UMPEG]
      },
      {
        path: '/dashboard/activities',
        label: 'Kegiatan',
        element: Dashboard.Activities,
        roles: [Role.ADMIN, Role.UMPEG]
      },
      {
        path: '/dashboard/subactivities',
        label: 'Sub Kegiatan',
        element: Dashboard.SubActivities,
        roles: [Role.ADMIN, Role.UMPEG]
      }
    ]
  },
  {
    label: 'Rencana Kerja Tahunan',
    icon: ClusterOutlined,
    roles: [Role.ADMIN, Role.UMPEG],
    children: [
      {
        path: '/dashboard/rkts',
        label: 'RKT',
        element: Dashboard.Rkts,
        roles: [Role.ADMIN, Role.UMPEG],
        permissions: ['manage_rkts']
      },
      {
        path: '/dashboard/assessment_periods',
        label: 'Periode Penilaian',
        element: Dashboard.AssessmentPeriod,
        roles: [Role.ADMIN, Role.UMPEG]
      },
      {
        path: '/dashboard/perjanjian_kinerja',
        label: 'Perjanjian Kinerja',
        element: Dashboard.PerjanjianKinerjas,
        roles: [Role.ADMIN, Role.UMPEG]
      }
    ]
  },
  {
    label: 'SKP',
    icon: FileProtectOutlined,
    path: '/dashboard/skps',
    element: Dashboard.Skps,
    roles: [Role.ADMIN, Role.ASN]
  },
  {
    label: 'Umpeg',
    icon: UsergroupAddOutlined,
    path: '/dashboard/umpegs',
    element: Dashboard.Umpegs,
    roles: [Role.ADMIN]
  },
  {
    label: 'JPT',
    icon: UsergroupAddOutlined,
    path: '/dashboard/jpts',
    element: Dashboard.Jpts,
    roles: [Role.ADMIN]
  },
  {
    label: 'Verificator',
    icon: UsergroupAddOutlined,
    path: '/dashboard/varificator',
    element: Dashboard.Verificators,
    roles: [Role.ADMIN],
    isMaintenance: true
  },
  {
    label: 'Web Settings',
    icon: SettingOutlined,
    path: '/dashboard/web_settings',
    element: Dashboard.WebSettings,
    roles: [Role.ADMIN],
    isMaintenance: true
  },
  {
    label: 'Verifikasi',
    icon: CheckCircleOutlined,
    path: '/dashboard/verificate_perjanjian_kinerja',
    element: Dashboard.VerificatePerjanjianKinerjas,
    roles: [Role.ADMIN],
    isMaintenance: true
  },
  {
    label: 'Kegiatan Harian',
    icon: CalendarOutlined,
    path: '/dashboard/harian',
    element: Dashboard.Daily,
    roles: [Role.ADMIN, Role.PIMPINAN, Role.UMPEG, Role.JPT, Role.ASN],
    isMaintenance: true
  },
  {
    label: 'Absensi',
    icon: ScheduleOutlined,
    path: '/dashboard/absence',
    element: Dashboard.Absence,
    roles: [Role.ADMIN, Role.PIMPINAN, Role.UMPEG, Role.JPT, Role.ASN],
    isMaintenance: true
  },
  {
    label: 'Kalender',
    icon: CalendarOutlined,
    path: '/dashboard/calendar',
    element: Dashboard.Calendars,
    roles: [Role.ADMIN, Role.PIMPINAN, Role.UMPEG, Role.JPT, Role.ASN],
    isMaintenance: true
  },
  {
    label: 'Request Sample 2',
    icon: DatabaseOutlined,
    path: '/dashboard/harians',
    element: Dashboard.Harians,
    roles: [Role.ADMIN],
    isMaintenance: true
  }
];

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
