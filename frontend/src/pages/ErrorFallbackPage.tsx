import { Button } from '@/components/ui/button'
import { FallbackProps } from 'react-error-boundary'

export const ErrorFallbackPage = ({
    error,
    resetErrorBoundary,
}: FallbackProps) => {
    return (
        <div className="text-center min-h-screen flex flex-col items-center justify-center gap-3">
            <h1 className="text-5xl font-semibold text-red-500">
                Oops, something went wrong!
            </h1>
            <p className="text-2xl text-gray-400 font-semibold">
                {error.message ?? error.title ?? error.statusText} (
                {error.status})
            </p>
            <Button
                className="rounded-full"
                onClick={() => resetErrorBoundary()}
            >
                Reload Page
            </Button>
        </div>
    )
}

export default ErrorFallbackPage
