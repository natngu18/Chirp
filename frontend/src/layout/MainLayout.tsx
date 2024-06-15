import ScrollToTop from '@/components/ScrollToTop'
import { Toaster } from '@/components/ui/toaster'
import ErrorFallbackPage from '@/pages/ErrorFallbackPage'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Scroll to top on router navigations */}
            <ScrollToTop />
            {/* Error boundary will catch errors thrown from React-Query (throwOnError option) */}
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        onReset={reset}
                        fallbackRender={({ error, resetErrorBoundary }) => (
                            <ErrorFallbackPage
                                error={error}
                                resetErrorBoundary={resetErrorBoundary}
                            />
                        )}
                    >
                        <Outlet />
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
            <Toaster />
        </div>
    )
}
