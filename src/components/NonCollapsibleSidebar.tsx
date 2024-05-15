import { useState, useEffect } from 'react'
import { SideNav } from './Sidenav'
import { NavItem } from './types'

type Props = {
    navItems: NavItem[]
}
export const NonCollapsibleSidebar = ({ navItems }: Props) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <div className="px-3 py-6 ">
                <SideNav items={navItems} />
            </div>
        </>
    )
}
