import { Navigate, Outlet } from 'react-router'
import { AuthProvider } from './features/auth/context/AuthContext'
import { Suspense } from 'react'
import { AuthenticationGuard } from './features/auth/components/AuthenticationGuard'
import { lazyImport } from './lib/lazyImport'
import MainLayout from './layout/MainLayout'
import { Spinner } from './components/Spinner'

const { HomePage } = lazyImport(() => import('@/pages/HomePage'), 'HomePage')
const { LoginPage } = lazyImport(() => import('@/pages/LoginPage'), 'LoginPage')
const { SignUpPage } = lazyImport(
    () => import('@/pages/SignUpPage'),
    'SignUpPage'
)

// TODO: Userprofile and home page Shouldn't be lazy loaded, suspense should be based on fetching the data...
// Or could it be both?
const { UserProfile } = lazyImport(
    () => import('./features/user/components/UserProfile'),
    'UserProfile'
)

const { TwitterLayout } = lazyImport(
    () => import('./layout/TwitterLayout'),
    'TwitterLayout'
)
import { loader as userProfileLoader } from './features/user/components/UserProfile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { SuspenseLayout } from './layout/SuspenseLayout'
const queryClient = new QueryClient()

const MainApp = () => {
    return (
        <TwitterLayout>
            <Suspense
                fallback={
                    <div className="flex size-full items-center justify-center">
                        <Spinner size="xl" />
                    </div>
                }
            >
                <Outlet />
            </Suspense>
        </TwitterLayout>
    )
}
const routesForAuthenticatedOnly = [
    {
        path: '/',
        element: (
            <AuthenticationGuard>
                <MainApp />
            </AuthenticationGuard>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'test',
                element: <div className="h-[2000px]">2</div>,
            },
            {
                path: 'profile/:username',
                element: <UserProfile />,
                loader: userProfileLoader(queryClient),
            },
        ],
    },
]
const routesForPublic = [
    {
        path: 'register',
        element: <SignUpPage />,
    },
    {
        path: 'login',
        element: <LoginPage />,
    },
]
const router = createBrowserRouter([
    {
        element: <SuspenseLayout />,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    ...routesForPublic,
                    ...routesForAuthenticatedOnly,
                    {
                        path: '*',
                        element: <Navigate to="/" />,
                    },
                ],
            },
        ],
    },
])
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
