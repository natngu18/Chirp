import CollapsibleSidebar from '@/components/CollapsibleSidebar'
import { NavItem } from '@/components/types'
import { useAuth } from '@/features/auth/context/AuthContext'
import PostDetailsModal from '@/features/post/components/PostDetailsModal'
import { Searchbar } from '@/features/search/components/Searchbar'
import WhoToFollowCard from '@/features/user/components/WhoToFollowCard'
import useMediaQuery from '@/hooks/useMediaQuery'
import { CircleUserRoundIcon, HomeIcon, SearchIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export const TwitterLayout = ({ children }: { children: React.ReactNode }) => {
    const { appUser } = useAuth()
    const isSmallerThanLgScreen = useMediaQuery('(max-width: 1024px)')
    const location = useLocation()
    const isOnSearchRoute = location.pathname === '/search'
    const userNavItems: NavItem[] = [
        {
            title: 'Home',
            icon: HomeIcon,
            href: '', // index route
            color: 'text-sky-500',
        },

        {
            title: 'Profile',
            icon: CircleUserRoundIcon,
            href: `/profile/${appUser?.username}`,
            color: 'text-sky-500',
        },
        // Conditionally render the search icon
        ...(isSmallerThanLgScreen
            ? [
                  {
                      title: 'Search',
                      icon: SearchIcon,
                      href: '/search',
                      color: 'text-sky-500',
                  },
              ]
            : []),
    ]
    return (
        <div className="flex w-full justify-center ">
            <CollapsibleSidebar navItems={userNavItems} />
            <div className="min-h-screen w-full max-w-xl  border-x-0 border-r border-light-border  dark:border-dark-border xs:border-x">
                {children}
                {/* Modal to view details for a single post, when image is clicked. */}
                <PostDetailsModal />
            </div>

            <div className="w-96 flex-col gap-4 px-4 py-3 pt-1 hidden lg:flex">
                {/* Hide searchbar because Searchbar displayed in search route */}
                {!isOnSearchRoute && <Searchbar />}
                <WhoToFollowCard />
            </div>
        </div>
    )
}
