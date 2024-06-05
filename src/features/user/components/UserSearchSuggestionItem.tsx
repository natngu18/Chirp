import { motion } from 'framer-motion'
import { UserBriefResponse } from '../types'

type Props = {
    user: UserBriefResponse
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
        <motion.div
            className="flex gap-3 items-center"
            variants={variants}
            initial="hidden"
            animate="show"
        >
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                    src={user.avatar.url}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="aspect-square h-full w-full"
                />
            </span>

            <div>
                <div className="font-semibold">{user.displayName}</div>
                <div className="text-gray-500">@{user.username}</div>
            </div>
        </motion.div>
    )
}

export default UserSearchSuggestionItem
