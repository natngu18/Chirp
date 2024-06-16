import { useNavigate, useParams } from 'react-router'
import { useInView } from 'react-intersection-observer'
import { CalendarIcon, MapPin } from 'lucide-react'
import FollowButton from '../features/user/components/FollowButton'
import { formatInTimeZone } from '@/lib/utils'
import { parseISO } from 'date-fns'
import { useGetUserByUsername } from '../features/user/api/getUserByUsername'
import { Spinner } from '@/components/Spinner'
import UserTabs from '../features/user/components/UserTabs'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/button'
import EditProfileModal from '../features/user/components/EditProfileModal'
import Image from '../features/image/components/Image'
import StickyHeader from '@/components/StickyHeader'

export const UserProfilePage = () => {
    const { firebaseUser } = useAuth()
    const params = useParams()
    const { data: user } = useGetUserByUsername(params.username!)
    const [headerRef, inView] = useInView({
        triggerOnce: false,
        threshold: 0,
        initialInView: true, // Follow button in fixed header should not be shown initially
    })

    const navigate = useNavigate()

    if (!user)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Spinner />
            </div>
        )

    return (
        <div className="relative min-h-screen flex flex-col ">
            {/* Fixed header */}
            <StickyHeader
                title={user?.username}
                backButtonAction={() => navigate(-1)}
            >
                {firebaseUser?.uid != user.id && (
                    <FollowButton
                        className="w-24"
                        isFollowing={user.isFollowing}
                        username={user.username}
                        isShown={!inView}
                    />
                )}
            </StickyHeader>

            {/* User profile */}
            <div className="relative flex flex-col w-full gap-2 ">
                {/* background */}

                {user.backgroundImage ? (
                    <Image
                        key={user.avatar.url} // Add this line
                        src={user.backgroundImage.url}
                        className="aspect-[3/1] sm:min-h-[200px]"
                        rounded={false}
                    />
                ) : (
                    <div className="flex aspect-[3/1] sm:min-h-[200px]  h-full w-full bg-gray-300"></div>
                )}

                <div className="relative flex justify-end  px-6">
                    <Image
                        key={user.avatar.url} // Add this line
                        src={user.avatar.url}
                        alt={user.username}
                        className="aspect-square p-[2px] bg-background absolute bottom-0 left-6  h-24 w-24"
                        rounded={true}
                    />
                    {/* Current user */}
                    {firebaseUser?.uid != user.id ? (
                        <FollowButton
                            className="w-24"
                            isShown={inView}
                            ref={headerRef}
                            username={user.username}
                            isFollowing={user.isFollowing}
                        />
                    ) : (
                        <EditProfileModal>
                            <Button variant="outline" className="rounded-full">
                                Edit profile
                            </Button>
                        </EditProfileModal>
                    )}
                </div>

                <div className="flex flex-col px-6 gap-2 pb-3">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">
                            {user.displayName}
                        </span>
                        <span className="text-lg text-gray-500">
                            @{user.username}
                        </span>
                    </div>
                    {user.bio && <p aria-label="User bio">{user.bio}</p>}

                    <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-md text-gray-500">
                            {/* Add Z at end of string to indicate date is in UTC. */}
                            <CalendarIcon size={16} />
                            {formatInTimeZone(
                                parseISO(`${user.createdAt}Z`),
                                "'Joined' MMM yyyy"
                            )}
                        </span>
                        {user.location && (
                            <span
                                aria-label="User location"
                                className="flex items-center gap-1 text-md text-gray-500"
                            >
                                <MapPin size={16} />
                                {user.location}
                            </span>
                        )}
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
            </div>
        </div>
    )
}
