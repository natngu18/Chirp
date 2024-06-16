import { useEffect, useState } from 'react'
import { SideNav } from './Sidenav'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/context/SidebarContext'
import { NavItem } from './types'
import UserMenu from '@/features/user/components/UserMenu'
import useMediaQuery from '@/hooks/useMediaQuery'
import CreatePostModalTrigger from '@/features/post/components/CreatePostModal'
import { Button } from './ui/button'
import { IoCreateOutline } from 'react-icons/io5'
import { PiBirdLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'

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
            <div className="relative h-full">
                <div className="sticky top-3 space-y-4 ">
                    <div className="px-3">
                        <div className="mt-3 space-y-1 flex flex-col gap-3">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 w-fit px-3 pt-2 ${
                                    !isSmallerThanXlScreen
                                        ? ''
                                        : 'justify-center'
                                }`}
                            >
                                <PiBirdLight className="stroke h-8 w-8 text-sky-500 stroke-[1.5]" />
                                {!isSmallerThanXlScreen && (
                                    <p className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
                                        Chirp
                                    </p>
                                )}
                            </Link>
                            <SideNav
                                className="text-background opacity-0 transition-all duration-300 group-hover:z-50  group-hover:rounded group-hover:bg-foreground group-hover:p-1 group-hover:opacity-100 text-xs absolute -bottom-1/4 left-1/2 transform -translate-x-1/2  "
                                items={navItems}
                            />
                            <CreatePostModalTrigger>
                                {isSmallerThanXlScreen ? (
                                    <button
                                        aria-label="Create post modal"
                                        className="self-center  hover:bg-sky-500/90 transition-colors flex items-center justify-center bg-sky-500 text-white rounded-full w-fit p-3 "
                                    >
                                        <IoCreateOutline className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <Button className="rounded-full text-lg h-12 w-full bg-sky-500  hover:bg-sky-500/90">
                                        Post
                                    </Button>
                                )}
                            </CreatePostModalTrigger>
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
