import { RouterProvider } from 'react-router'
import router from './routes/Router'
import { AuthProvider } from './features/auth/context/AuthContext'

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
