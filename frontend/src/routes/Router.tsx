import MainLayout from '@/layout/MainLayout'
import { SuspenseLayout } from '@/layout/SuspenseLayout'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { routesForAuthenticatedOnly } from './Protected'
import { routesForPublic } from './Public'

export const router = createBrowserRouter([
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
