import { motion } from 'framer-motion'
import { UserBriefResponse } from '../types'
import Image from '@/features/image/components/Image'

type Props = {
    user: UserBriefResponse
    type?: ''
}
const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}
function UserSearchSuggestionItem({ user }: Props) {
    return (
        // fake outer link for card body
        <motion.div
            className="flex items-center justify-between"
            variants={variants}
            initial="hidden"
            animate="show"
        >
            <div className="flex gap-3 items-center">
                <Image
                    className="h-10 w-10 clickable-object"
                    src={user.avatar.url}
                    alt={user.username}
                    rounded={true}
                />

                <div>
                    <div className="font-semibold overflow-hidden text-overflow ellipsis whitespace-nowrap">
                        {user.displayName}
                    </div>

                    <div className="text-gray-500 overflow-hidden text-overflow ellipsis whitespace-nowrap">
                        @{user.username}
                    </div>
                    {user.isFollowing && (
                        <div className="text-gray-500 text-xs">Followed</div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default UserSearchSuggestionItem
