import LoadingPage from '@/pages/LoadingPage'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const SuspenseLayout = () => (
    <React.Suspense fallback={<LoadingPage />}>
        <Outlet />
    </React.Suspense>
)
