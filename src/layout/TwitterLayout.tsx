import CollapsibleSidebar from '@/components/CollapsibleSidebar'
import { NavItem } from '@/components/types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Searchbar } from '@/features/search/components/Searchbar'
import { CircleUserRoundIcon, LayoutDashboard } from 'lucide-react'

export const TwitterLayout = ({ children }: { children: React.ReactNode }) => {
    const { appUser } = useAuth()
    const userNavItems: NavItem[] = [
        {
            title: 'Home',
            icon: LayoutDashboard,
            href: '', // index route
            color: 'text-sky-500',
        },

        {
            title: 'Categories',
            icon: LayoutDashboard,
            href: '/test',
            color: 'text-sky-500',
        },
        {
            title: 'Profile',
            icon: CircleUserRoundIcon,
            href: `/profile/${appUser?.username}`,
            color: 'text-sky-500',
        },
    ]
    return (
        <div className="flex w-full justify-center ">
            {/* TODO: Disable collapse button on non-mobile
                (No point to collapse on desktop, since it doesn't make main screen bigger,
                    infact it makes it worse since main feed is off-center
                )
            */}
            <CollapsibleSidebar navItems={userNavItems} />
            <div className="hover-animation flex min-h-screen w-full max-w-xl flex-col border-x-0 border-light-border pb-96 dark:border-dark-border xs:border-x">
                {/* <Outlet /> */}
                {children}
            </div>

            <div className="border-l w-96 flex-col gap-4 px-4 py-3 pt-1 hidden lg:flex">
                <Searchbar />
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint
                dolorem neque quis fuga in deserunt omnis accusantium? Quod
                deserunt quaerat deleniti magnam suscipit quas nam. Id,
                praesentium repellendus. At, dolorum facilis minima perspiciatis
                aliquam quae ipsa. Recusandae ex harum, natus illum ut incidunt,
                laboriosam amet pariatur officia laudantium distinctio eaque.
            </div>
        </div>
    )
}
