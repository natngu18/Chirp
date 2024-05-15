import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SidebarProvider } from './components/context/SidebarContext.tsx'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
                <App />
            </SidebarProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
