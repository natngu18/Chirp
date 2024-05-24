import { Spinner } from '@/components/Spinner'
import { AuthenticationGuard } from '@/features/auth/components/AuthenticationGuard'
import { TwitterLayout } from '@/layout/TwitterLayout'
import { lazyImport } from '@/lib/lazyImport'
import { Suspense } from 'react'
import { Outlet } from 'react-router'

const { HomePage } = lazyImport(() => import('@/pages/HomePage'), 'HomePage')
const { SearchPage } = lazyImport(
    () => import('@/pages/SearchPage'),
    'SearchPage'
)
// TODO: Userprofile and home page Shouldn't be lazy loaded, suspense should be based on fetching the data...
// Or could it be both?
const { UserProfile } = lazyImport(
    () => import('@/features/user/components/UserProfile'),
    'UserProfile'
)
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
export const routesForAuthenticatedOnly = [
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
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
        ],
    },
]
