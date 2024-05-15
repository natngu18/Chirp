import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'
export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Error boundary will catch errors thrown from React-Query (throwOnError option) */}

            <Outlet />

            <Toaster />
        </div>
    )
}
