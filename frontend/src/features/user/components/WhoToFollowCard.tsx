import { useGetTopFollowedUsers } from '../api/getTopFollowedUsers'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import UserWhoToFollowItem from './UserWhoToFollowItem'
function WhoToFollowCard() {
    const query = useGetTopFollowedUsers({ userCount: 5 })
    console.log(query.data)
    return (
        <Card className="">
            <CardHeader className="p-0">
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            {query.data?.map((user) => (
                <UserWhoToFollowItem key={user.id} user={user} />
            ))}
            <CardContent className="p-0">
                <p>Card Content</p>
            </CardContent>
            <CardFooter className="p-0">
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default WhoToFollowCard
