import { Result, Skeleton } from 'antd';
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
  DetailRkt,
  DetailSkp,
  DetailSkpPenilaian,
  GoalsIndicators,
  JabatanUmpeg,
  Mph,
  ProgramsIndicators,
  RencanaAksi,
  SkpAssessmentPeriod,
  SkpBawahan,
  SubAcitivitiesIndicators,
  UserProfile
} from './pages/dashboard';

function App() {
  const { isLoading, user } = useAuth();
  const flatLandingLinks = flattenLandingLinks(landingLink);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <LandingLayout />,
          children: [
            // Tambahkan route dari landingLink
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
                return item.children.map(({ permissions, roles, path, element: Element }) => {
                  if (isLoading) {
                    return { path, element: <Skeleton active /> };
                  }

                  const hasPermissions = permissions && permissions.length > 0;
                  const hasRoles = roles && roles.length > 0;
                  const userCantDoAnyOfThat = hasPermissions && (!user || user.cantDoAny(...permissions));
                  const userIsNotInAnyOfThatRole = hasRoles && (!user || !roles.some((role) => user.is(role)));

                  if (userCantDoAnyOfThat && userIsNotInAnyOfThatRole) {
                    return { path, element: <Result status="403" subTitle="Anda tidak memiliki akses ke halaman ini" title="Forbidden" /> };
                  }

                  return { path, element: <Element /> };
                });
              }

              return [
                {
                  path: item.path,
                  element: isLoading ? <Skeleton active /> : <item.element />
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
            { path: '/dashboard/umpegs/:id', element: <JabatanUmpeg /> }
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
