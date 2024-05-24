import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import UserPostsTab from './UserPostsTab'
import UserRepliesTab from './UserRepliesTab'
const USER_TAB_NAMES = ['Posts', 'Replies', 'Media', 'Likes']

type Props = {
    username: string
}
function UserTabs({ username }: Props) {
    const [tabValue, setTabValue] = useState(USER_TAB_NAMES[0])
    return (
        <div>
            <Tabs
                className="w-full"
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
            >
                <TabsList className="flex justify-between w-full bg-white p-0 m-0">
                    {USER_TAB_NAMES.map((tabName) => (
                        <TabsTrigger
                            key={tabName}
                            // {/* Add bg to trigger to make hover effect work */}
                            className="h-full relative flex w-full data-[state=active]:shadow-none clickable-object bg-white rounded-none"
                            value={tabName}
                        >
                            {tabName}
                            {tabValue === tabName && (
                                <span className="absolute bottom-0 w-1/4 h-1  bg-blue-500 rounded-full"></span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Separator />
                <TabsContent value={USER_TAB_NAMES[0]} className="m-0">
                    {/* Make changes to your account here. */}
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
