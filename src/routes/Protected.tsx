import { AuthenticationGuard } from '@/features/auth/components/AuthenticationGuard'
import TwitterLayout from '@/layout/TwitterLayout'
import HomePage from '@/pages/HomePage'
import path from 'path'

export const routesForAuthenticatedOnly = [
    {
        path: '/',
        element: <AuthenticationGuard />,
        children: [
            {
                path: '/',
                element: <TwitterLayout />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: 'test',
                        element: <div className="h-[2000px]">2</div>,
                    },
                    {
                        path: 'profile/:username',
                        element: <div>Profile</div>,
                    },
                ],
            },
        ],
    },
]
