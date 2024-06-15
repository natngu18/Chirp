import { Spinner } from '@/components/Spinner'
import { PostDetailsModalProvider } from '@/components/context/PostModalContext'
import { AuthenticationGuard } from '@/features/auth/components/AuthenticationGuard'
import PostDetails from '@/features/post/components/PostDetails'
import { TwitterLayout } from '@/layout/TwitterLayout'
import { lazyImport } from '@/lib/lazyImport'
import { Suspense } from 'react'
import { Outlet } from 'react-router'

const { HomePage } = lazyImport(() => import('@/pages/HomePage'), 'HomePage')
const { SearchPage } = lazyImport(
    () => import('@/pages/SearchPage'),
    'SearchPage'
)

const { UserProfilePage } = lazyImport(
    () => import('@/pages/UserProfilePage'),
    'UserProfilePage'
)
const MainApp = () => {
    return (
        // Modal provider needs to be wrapped by RouterProvider, since it uses useLocation.
        <PostDetailsModalProvider>
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
        </PostDetailsModalProvider>
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
                path: 'profile/:username',
                element: <Outlet />,
                children: ['replies', `posts`, 'media', 'likes', ''].map(
                    (path) => ({
                        path,
                        element: <UserProfilePage />,
                    })
                ),
            },
            {
                path: 'search',
                element: <SearchPage />,
            },
            {
                path: 'post/:postId',
                element: <PostDetails />,
            },
        ],
    },
]
