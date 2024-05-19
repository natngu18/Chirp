import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SidebarProvider } from './components/context/SidebarContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SidebarProvider>
            <App />
        </SidebarProvider>
    </React.StrictMode>
)
