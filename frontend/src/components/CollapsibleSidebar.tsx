import { useEffect, useState } from 'react'
import { SideNav } from './Sidenav'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/context/SidebarContext'
import { NavItem } from './types'
import UserMenu from '@/features/user/components/UserMenu'
import useMediaQuery from '@/hooks/useMediaQuery'

interface SidebarProps {
    className?: string
    navItems: NavItem[]
}

export default function CollapsibleSidebar({
    className,
    navItems,
}: SidebarProps) {
    const { isOpen, setIsOpen } = useSidebar()
    const [status, setStatus] = useState(false)

    const isSmallerThanXlScreen = useMediaQuery('(max-width: 1280px)')

    useEffect(() => {
        if (isSmallerThanXlScreen) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
        setStatus(true)
        setTimeout(() => setStatus(false), 500)
    }, [isSmallerThanXlScreen, setIsOpen])
    return (
        <nav
            className={cn(
                `relative   border-r md:block`,
                status && 'duration-500',
                isOpen ? 'w-72' : 'w-[78px]',
                className
            )}
        >
            <div className="relative pt-20 h-full">
                <div className="sticky top-3 space-y-4 py-4">
                    <div className="px-3 py-2">
                        <div className="mt-3 space-y-1">
                            <SideNav
                                className="text-background opacity-0 transition-all duration-300 group-hover:z-50  group-hover:rounded group-hover:bg-foreground group-hover:p-1 group-hover:opacity-100 text-xs absolute -bottom-1/4 left-1/2 transform -translate-x-1/2  "
                                items={navItems}
                            />
                        </div>
                    </div>
                </div>
                <div className="sticky top-[92%]">
                    <div className="flex items-center justify-center w-full">
                        <UserMenu
                            isSmallerThanXlScreen={isSmallerThanXlScreen}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}