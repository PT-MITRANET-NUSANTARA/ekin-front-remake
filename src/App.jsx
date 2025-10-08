import { Skeleton } from 'antd';
import { authLink, dashboardLink, landingLink } from './data/link';
import { useAuth } from './hooks';
import { AuthLayout, DashboardLayout, LandingLayout } from './layouts';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import './index.css';
import { flattenLandingLinks } from './utils/landingLink';
import { Notfound } from './pages/result';
import {
  ActivitiesIndicators,
  Assessment,
  AssessmentKinerja,
  AssessmentPerilaku,
  AssessmentSkp,
  Curva,
  DetailRkt,
  DetailSkp,
  DetailSkpPenilaian,
  GoalsIndicators,
  JabatanUmpeg,
  JabatanVerificators,
  Mph,
  PerjanjianKinerjaTemplate,
  ProgramsIndicators,
  RencanaAksi,
  SkpAssessmentPeriod,
  SkpBawahan,
  SkpDownload,
  SubAcitivitiesIndicators,
  UserProfile
} from './pages/dashboard';
import RequirePermission from './components/dashboard/RequirePermission';

function App() {
  const { isLoading } = useAuth();
  const flatLandingLinks = flattenLandingLinks(landingLink);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <LandingLayout />,
          children: [
            ...flatLandingLinks.map(({ path, element: Element }) => ({
              path,
              element: <Element />
            })),

            { path: '*', element: <Notfound /> }
          ]
        },
        {
          element: <DashboardLayout />,
          children: [
            ...dashboardLink.flatMap((item) => {
              if (item.children) {
                return item.children.map(({ path, element: Element, permissions = [] }) => ({
                  path,
                  element: isLoading ? (
                    <Skeleton active />
                  ) : (
                    <RequirePermission required={permissions}>
                      <Element />
                    </RequirePermission>
                  )
                }));
              }

              return [
                {
                  path: item.path,
                  element: isLoading ? (
                    <Skeleton active />
                  ) : (
                    <RequirePermission required={item.permissions || []}>
                      <item.element />
                    </RequirePermission>
                  )
                }
              ];
            }),

            { path: '/dashboard/goals/:id', element: <GoalsIndicators /> },
            { path: '/dashboard/programs/:id', element: <ProgramsIndicators /> },
            { path: '/dashboard/activities/:id', element: <ActivitiesIndicators /> },
            { path: '/dashboard/subactivities/:id', element: <SubAcitivitiesIndicators /> },
            { path: '/dashboard/rkts/:id', element: <DetailRkt /> },
            { path: '/dashboard/skps/:id', element: <DetailSkp /> },
            { path: '/dashboard/skps/:id/matriks', element: <Mph /> },
            { path: '/dashboard/skps/:id/skp_bawahan', element: <SkpBawahan /> },
            { path: '/dashboard/skps/:id/assessment_periods', element: <SkpAssessmentPeriod /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment', element: <Assessment /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/detail', element: <DetailSkpPenilaian /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/rencana_aksi', element: <RencanaAksi /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/penilaian_kinerja', element: <AssessmentKinerja /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/penilaian_perilaku', element: <AssessmentPerilaku /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/predikat', element: <AssessmentSkp /> },
            { path: '/dashboard/user_profile', element: <UserProfile /> },
            { path: '/dashboard/umpegs/:id', element: <JabatanUmpeg /> },
            { path: '/dashboard/verificator/:id/:unit_id/jabatan/:unor_id', element: <JabatanVerificators /> },
            { path: '/dashboard/perjanjian-kinerja-template', element: <PerjanjianKinerjaTemplate /> },
            { path: '/dashboard/skp-download/:id', element: <SkpDownload /> },
            { path: '/dashboard/skps/:id/assessment_periods/:assessment_periode_id/assessment/curva', element: <Curva /> }
          ]
        },
        {
          element: <AuthLayout />,
          children: authLink.map(({ path, element: Element }) => ({
            path,
            element: <Element />
          }))
        }
      ])}
    />
  );
}

export default App;
