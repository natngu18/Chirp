import { useNavigate, useParams } from 'react-router'
import { useInView } from 'react-intersection-observer'
import CircularButton from '@/components/CircularButton'
import { ArrowLeftIcon, CalendarIcon } from 'lucide-react'
import FollowButton from './FollowButton'
import { formatInTimeZone } from '@/lib/utils'
import { parseISO } from 'date-fns'
import { useGetUserByUsername } from '../api/getUserByUsername'
import { Spinner } from '@/components/Spinner'
import UserTabs from './UserTabs'

export const UserProfile = () => {
    const params = useParams()
    const { data: user } = useGetUserByUsername(params.username!)
    const [headerRef, inView] = useInView({
        triggerOnce: false,
        threshold: 0,
        initialInView: true,
    })

    const navigate = useNavigate()

    if (!user)
        return (
            // TODO use loading skeletons
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Spinner />
            </div>
        )

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Fixed header */}
            <div
                className={`sticky top-0 backdrop-blur-xl z-50 bg-white/50 flex gap-3 justify-between items-center p-4 transition-opacity duration-200`}
            >
                <div className="flex gap-3 items-center">
                    <CircularButton onClick={() => navigate(-1)}>
                        <ArrowLeftIcon size={20} />
                    </CircularButton>
                    <h1 className="text-xl">{user?.username}</h1>
                </div>

                {/* Show this follow button when other one is NOT in view. */}
                <FollowButton
                    className="w-28"
                    isShown={!inView}
                    userId={user.id}
                    isFollowing={user.isFollowing}
                    username={user.username}
                />
            </div>

            {/* User profile */}
            <div className="relative flex flex-col w-full gap-2 ">
                <div className="relative h-[180px] w-full bg-slate-400"></div>

                <div className="relative flex justify-end  px-4">
                    <span className="absolute bottom-0 left-6 flex h-24 w-24 shrink-0 overflow-hidden rounded-full">
                        <img
                            src={user.avatar.url}
                            alt={user.username}
                            referrerPolicy="no-referrer"
                            className="aspect-square h-full w-full"
                        />
                    </span>

                    <div>
                        <FollowButton
                            className="w-28"
                            isShown={inView}
                            ref={headerRef}
                            userId={user.id}
                            username={user.username}
                            isFollowing={user.isFollowing}
                        />
                    </div>
                </div>

                <div className="flex flex-col px-3 gap-2">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">
                            {user.displayName}
                        </span>
                        <span className="text-lg text-gray-500">
                            @{user.username}
                        </span>
                    </div>
                    <p>
                        Stay moist http://twitch.tv/moistcr1tikal/ owner of
                        @moistesports
                    </p>

                    {user.bio && <p>{user.bio}</p>}
                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-md text-gray-500">
                            {/* Add Z at end of string to indicate date is in UTC. */}
                            <CalendarIcon size={16} />
                            {formatInTimeZone(
                                parseISO(`${user.createdAt}Z`),
                                "'Joined' MMM yyyy"
                            )}
                        </span>
                    </div>

                    <div className="flex text-sm gap-3">
                        <div>
                            <span className="font-semibold">
                                {user.followersCount}
                            </span>{' '}
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

                <UserTabs username={user.username} />
                {/* <Separator /> */}
            </div>
        </div>
    )
}
