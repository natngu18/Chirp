import { Navigate, createBrowserRouter } from 'react-router-dom'
import { routesForPublic } from './Public'
import MainLayout from '@/layout/MainLayout'
import { routesForAuthenticatedOnly } from './Protected'
import TwitterLayout from '@/layout/TwitterLayout'

const router = createBrowserRouter([
    {
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
])

export default router
