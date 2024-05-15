import { useState } from 'react'
import { SideNav } from './Sidenav'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import { useSidebar } from '@/components/context/SidebarContext'
import { NavItem } from './types'
interface SidebarProps {
    className?: string
    navItems: NavItem[]
}

export default function CollapsibleSidebar({
    className,
    navItems,
}: SidebarProps) {
    const { isOpen, toggle } = useSidebar()
    const [status, setStatus] = useState(false)

    const handleToggle = () => {
        setStatus(true)
        toggle()
        setTimeout(() => setStatus(false), 500)
    }
    return (
        <nav
            className={cn(
                `relative border-r pt-20 md:block`,
                status && 'duration-500',
                isOpen ? 'w-72' : 'w-[78px]',
                className
            )}
        >
            <div className="sticky top-3 z-10">
                <ArrowLeftIcon
                    width={24}
                    height={24}
                    className={cn(
                        'absolute -right-3  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
                        !isOpen && 'rotate-180'
                    )}
                    onClick={handleToggle}
                />
            </div>

            <div className="sticky top-3 space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                        <SideNav
                            className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
                            items={navItems}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}
