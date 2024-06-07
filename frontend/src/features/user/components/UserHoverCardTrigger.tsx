import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'

import React from 'react'
import UserHoverCardContent from './UserHoverCardContent'
import { motion } from 'framer-motion'

type Props = {
    children: React.ReactNode
    username: string
}
const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.4,
        },
    },
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
                <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-2 w-full"
                >
                    <UserHoverCardContent username={username} />
                </motion.div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default UserHoverCardTrigger
