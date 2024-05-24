import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'

import React from 'react'
import UserHoverCardContent from './UserHoverCardContent'

type Props = {
    children: React.ReactNode
    username: string
}

function UserHoverCardTrigger({ children, username }: Props) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardContent
                className="pointer-events-auto hover:cursor-auto"
                onClick={(e) => {
                    // prevent parent link from triggering
                    e.stopPropagation()
                    e.preventDefault()
                }}
            >
                <UserHoverCardContent username={username} />
            </HoverCardContent>
        </HoverCard>
    )
}

export default UserHoverCardTrigger
