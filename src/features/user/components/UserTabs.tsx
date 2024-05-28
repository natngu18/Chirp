import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import UserPostsTab from './UserPostsTab'
import UserRepliesTab from './UserRepliesTab'
import { useLocation, useNavigate } from 'react-router-dom'
import { capitalize } from '@/lib/utils'
const USER_TAB_NAMES = ['posts', 'replies', 'media', 'likes']
type Props = {
    username: string
}
function UserTabs({ username }: Props) {
    const [tabValue, setTabValue] = useState(USER_TAB_NAMES[0])
    const location = useLocation()
    const lastElementFromUrl = location.pathname.split('/').pop()
    const navigate = useNavigate()
    // Reset tab value to default ("posts") when username changes and on initial render.
    useEffect(() => {
        setTabValue(USER_TAB_NAMES[0])
    }, [username])

    // Set tab value to the last element from the URL if it is one of the tab names.
    useEffect(() => {
        if (lastElementFromUrl && USER_TAB_NAMES.includes(lastElementFromUrl)) {
            setTabValue(lastElementFromUrl)
        }
    }, [lastElementFromUrl])

    return (
        <div>
            <Tabs
                className="w-full"
                value={tabValue}
                onValueChange={(value) => {
                    setTabValue(value)
                    navigate(`/profile/${username}/${value}`)
                }}
            >
                <TabsList className="flex justify-between w-full bg-white p-0 m-0">
                    {USER_TAB_NAMES.map((tabName) => (
                        <TabsTrigger
                            key={tabName}
                            // {/* Add bg to trigger to make hover effect work */}
                            className="h-full relative flex w-full data-[state=active]:shadow-none clickable-object bg-white rounded-none"
                            value={tabName}
                        >
                            {capitalize(tabName)}
                            {tabValue === tabName && (
                                <span className="absolute bottom-0 w-1/4 h-1  bg-blue-500 rounded-full"></span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Separator />
                <TabsContent value={USER_TAB_NAMES[0]} className="m-0">
                    <UserPostsTab username={username} />
                </TabsContent>
                <TabsContent value={USER_TAB_NAMES[1]} className="m-0">
                    <UserRepliesTab username={username} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserTabs
