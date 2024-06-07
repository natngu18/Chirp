import ScrollToTop from '@/components/ScrollToTop'
import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'
export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Outlet />
            <Toaster />
        </div>
    )
}
