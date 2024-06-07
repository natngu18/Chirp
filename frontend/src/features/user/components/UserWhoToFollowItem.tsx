import { UserBriefResponse } from '../types'
import { motion } from 'framer-motion'
import FollowButton from './FollowButton'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Image from '@/features/image/components/Image'
import { Spinner } from '@/components/Spinner'
import UserHoverCardTrigger from './UserHoverCardTrigger'

type Props = { user: UserBriefResponse }
const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}
function UserWhoToFollowItem({ user }: Props) {
    const { firebaseUser } = useAuth()
    const navigate = useNavigate()
    return (
        // fake outer link for card body
        <motion.div
            className="flex items-center justify-between hover:cursor-pointer hover:bg-slate-50 px-3 py-2 transition-colors duration-200"
            variants={variants}
            initial="hidden"
            animate="show"
            onClick={() => {
                navigate(`/profile/${user.username}`)
            }}
            data-href={`/profile/${user.username}`}
            tabIndex={0}
            role="link"
        >
            <div className="flex gap-3 items-center">
                <UserHoverCardTrigger username={user.username}>
                    <Link
                        to={`/profile/${user.username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            className="h-10 w-10 clickable-object"
                            src={user.avatar.url}
                            alt={user.username}
                            rounded={true}
                        />
                    </Link>
                </UserHoverCardTrigger>

                <div className="">
                    <Link
                        to={`/profile/${user.username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="font-semibold hover:underline overflow-hidden text-overflow ellipsis whitespace-nowrap">
                            {user.displayName}
                        </div>
                    </Link>

                    <Link
                        to={`/profile/${user.username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-gray-500 overflow-hidden text-overflow ellipsis whitespace-nowrap">
                            @{user.username}
                        </div>
                    </Link>
                </div>
            </div>

            {!firebaseUser ? (
                <div className="flex items-center justify-center w-20">
                    <Spinner />
                </div>
            ) : (
                <FollowButton
                    isShown={firebaseUser?.uid != user.id}
                    username={user.username}
                    isFollowing={user.isFollowing}
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </motion.div>
    )
}

export default UserWhoToFollowItem
