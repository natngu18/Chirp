import { QueryClient, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Params, useLoaderData, useNavigate, useParams } from 'react-router'
// import { getUserByUsernameQuery } from '../api/getUserByUsername'
import { useInView } from 'react-intersection-observer'
import CircularButton from '@/components/CircularButton'
import { ArrowLeftIcon, CalendarIcon } from 'lucide-react'
import FollowButton from './FollowButton'
import { Separator } from '@/components/ui/separator'
import { formatInTimeZone } from '@/lib/utils'
import { parseISO } from 'date-fns'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useGetUserByUsername } from '../api/getUserByUsername'
import { Spinner } from '@/components/Spinner'

// React Router Loader function.
// export const loader =
//     (queryClient: QueryClient) =>
//     async ({ params }: { params: Params<'username'> }) => {

//         const query = getUserByUsernameQuery(params.username!)
//         // return data or fetch it
//         //equivalent to queryClient.getQueryData(query.queryKey)
//         //?? (await queryClient.fetchQuery(query))
//         return await queryClient.ensureQueryData(query)
//     }

export const UserProfile = () => {
    // const initialData = useLoaderData() as Awaited<
    //     ReturnType<ReturnType<typeof loader>>
    // >
    // const { token } = useAuth()
    const params = useParams()
    // const { data: user } = useQuery({
    //     ...getUserByUsernameQuery(params.username!, token),
    //     // initialData: initialData,
    // })
    const { data: user } = useGetUserByUsername(params.username!)
    const [headerRef, inView] = useInView({
        triggerOnce: false,
        threshold: 0,
        initialInView: true,
    })

    console.log(user)
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

                <div className="flex flex-col px-3 gap-3">
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
                </div>

                <Separator />
            </div>
        </div>
    )
}
