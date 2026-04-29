import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const Login = lazy(() => import('./components/auth/Login'))
const Signup = lazy(() => import('./components/auth/Signup'))
const Home = lazy(() => import('./components/Home'))
const Jobs = lazy(() => import('./components/Jobs'))
const Browse = lazy(() => import('./components/Browse'))
const Profile = lazy(() => import('./components/Profile'))
const JobDescription = lazy(() => import('./components/JobDescription'))
const Companies = lazy(() => import('./components/admin/Companies'))
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'))
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'))
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'))
const PostJob = lazy(() => import('./components/admin/PostJob'))
const Applicants = lazy(() => import('./components/admin/Applicants'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))

const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-600 shadow-lg shadow-slate-200/70">
      Loading experience...
    </div>
  </div>
)

const withSuspense = (component) => (
  <Suspense fallback={<RouteLoader />}>
    {component}
  </Suspense>
)

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(<Home />)
  },
  {
    path: '/login',
    element: withSuspense(<Login />)
  },
  {
    path: '/signup',
    element: withSuspense(<Signup />)
  },
  {
    path: "/jobs",
    element: withSuspense(<Jobs />)
  },
  {
    path: "/description/:id",
    element: withSuspense(<JobDescription />)
  },
  {
    path: "/browse",
    element: withSuspense(<Browse />)
  },
  {
    path: "/profile",
    element: withSuspense(<Profile />)
  },
  {
    path:"/admin/companies",
    element: withSuspense(<ProtectedRoute><Companies/></ProtectedRoute>)
  },
  {
    path:"/admin/companies/create",
    element: withSuspense(<ProtectedRoute><CompanyCreate/></ProtectedRoute>) 
  },
  {
    path:"/admin/companies/:id",
    element: withSuspense(<ProtectedRoute><CompanySetup/></ProtectedRoute>) 
  },
  {
    path:"/admin/jobs",
    element: withSuspense(<ProtectedRoute><AdminJobs/></ProtectedRoute>) 
  },
  {
    path:"/admin/jobs/create",
    element: withSuspense(<ProtectedRoute><PostJob/></ProtectedRoute>) 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element: withSuspense(<ProtectedRoute><Applicants/></ProtectedRoute>) 
  },

])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
