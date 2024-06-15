import { AuthProvider } from './features/auth/context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Router'
const queryClient = new QueryClient({
    defaultOptions: {
        // error boundary catches thrown errors from react-query.
        // status codes 400, 401, 404 handled by app

        queries: {
            throwOnError(error: any) {
                return (
                    error.status !== 400 &&
                    // error.status !== 401 &&
                    error.status !== 404
                )
            },
        },
        mutations: {
            throwOnError(error: any) {
                return (
                    error.status !== 400 &&
                    // error.status !== 401 &&
                    error.status !== 404
                )
            },
        },
    },
})

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
