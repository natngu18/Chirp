import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'

export const routesForPublic = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <SignUpPage />,
    },
]
