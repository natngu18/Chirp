import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'

export const routesForPublic = [
    {
        path: 'register',
        element: <SignUpPage />,
    },
    {
        path: 'login',
        element: <LoginPage />,
    },
]
