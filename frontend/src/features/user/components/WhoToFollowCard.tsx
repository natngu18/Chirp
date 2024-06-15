import { useGetTopFollowedUsers } from '../api/getTopFollowedUsers'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import UserWhoToFollowItem from './UserWhoToFollowItem'
import { Spinner } from '@/components/Spinner'
function WhoToFollowCard() {
    const query = useGetTopFollowedUsers({ userCount: 5 })
    return (
        <Card className="">
            <CardHeader className="px-3 py-2">
                <CardTitle className="text-2xl font-semibold">
                    Who to follow
                </CardTitle>
            </CardHeader>

            {query.isLoading || !query.data ? (
                <div className="flex items-center justify-center h-32">
                    <Spinner />
                </div>
            ) : (
                query.data?.map((user) => (
                    <UserWhoToFollowItem key={user.id} user={user} />
                ))
            )}
        </Card>
    )
}

export default WhoToFollowCard
