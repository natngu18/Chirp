import React, { useState, useContext, createContext } from 'react'

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
}

const SidebarStateContext = createContext<SidebarContextType | undefined>(
    undefined
)

type Props = {
    children: React.ReactNode
}
export const SidebarProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(true)
    const toggle = () => setIsOpen(!isOpen)

    return (
        <SidebarStateContext.Provider value={{ isOpen, toggle }}>
            {children}
        </SidebarStateContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarStateContext)

    if (!context) {
        throw new Error('useSidebar must be used inside the SidebarProvider')
    }

    return context
}
