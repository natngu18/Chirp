import { useGetUserByUsername } from '../api/getUserByUsername'
import { Spinner } from '@/components/Spinner'
import FollowButton from './FollowButton'
import { Link } from 'react-router-dom'
import Image from '@/features/image/components/Image'
import { useAuth } from '@/features/auth/context/AuthContext'

type Props = { username: string }
function UserHoverCardContent({ username }: Props) {
    const { data: user, isLoading } = useGetUserByUsername(username)
    const { firebaseUser } = useAuth()
    if (isLoading || !user)
        return (
            <div className="flex items-center justify-center h-[75px]">
                <Spinner />
            </div>
        )
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
                <Link to={`/profile/${username}`}>
                    <Image
                        className="h-16 w-16 clickable-object"
                        src={user.avatar.url}
                        alt={user.username}
                        rounded={true}
                    />
                </Link>
                {firebaseUser?.uid !== user.id && (
                    <FollowButton
                        className="h-8"
                        isFollowing={user.isFollowing}
                        username={user.username}
                    />
                )}
            </div>
            <div className="flex flex-col">
                <Link to={`/profile/${username}`}>
                    <span className="font-semibold hover:underline">
                        {user.displayName}
                    </span>
                </Link>
                <Link to={`/profile/${username}`}>
                    <span className="text-gray-500">@{user.username}</span>
                </Link>
                <span>{user.bio} </span>
            </div>

            <div className="flex text-sm gap-3">
                <div>
                    <span className="font-semibold">{user.followersCount}</span>{' '}
                    <span className="text-gray-500">Followers</span>
                </div>

                <div>
                    <span className="font-semibold">
                        {user.followingsCount}
                    </span>{' '}
                    <span className="text-gray-500">Following</span>
                </div>
            </div>
        </div>
    )
}

export default UserHoverCardContent
