import { Outlet, Route, Routes } from 'react-router'
import { AuthProvider } from './features/auth/context/AuthContext'
import SuspenseRouter from './routes/SuspenseRouter'
import { Suspense } from 'react'
// import TwitterLayout from './layout/TwitterLayout'
import { AuthenticationGuard } from './features/auth/components/AuthenticationGuard'
import { lazyImport } from './lib/lazyImport'
import MainLayout from './layout/MainLayout'
import LoadingPage from './pages/LoadingPage'
import { Spinner } from './components/Spinner'
// import { TwitterLayout } from './layout/TwitterLayout'

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

function App() {
    return (
        <AuthProvider>
            <SuspenseRouter window={window}>
                <Suspense fallback={<LoadingPage />}>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path="/register" element={<SignUpPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/"
                                element={
                                    <AuthenticationGuard>
                                        <MainApp />
                                    </AuthenticationGuard>
                                }
                            >
                                <Route index={true} element={<HomePage />} />
                                <Route
                                    path="test"
                                    element={
                                        <div className="h-[2000px]">2</div>
                                    }
                                />
                                <Route
                                    path="profile/:username"
                                    element={<UserProfile />}
                                />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </SuspenseRouter>
            {/* <RouterProvider router={router} /> */}
        </AuthProvider>
    )
}

export default App
