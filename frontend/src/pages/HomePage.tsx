import { Separator } from '@/components/ui/separator'
import { useGetFollowedUsersPostsInfinite } from '@/features/post/api/getFollowedUsersPosts'
import PostForm from '@/features/post/components/PostForm'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Spinner } from '@/components/Spinner'
import PostList from '@/features/post/components/PostList'

export const HomePage = () => {
    const query = useGetFollowedUsersPostsInfinite({})
    const { ref, inView } = useInView()
    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage()
        }
    }, [inView, query])

    if (query.isLoading) {
        return (
            <div className="flex items-center w-full justify-center p-6">
                <Spinner />
            </div>
        )
    }

    return (
        <div className=" pt-4 flex flex-col">
            <PostForm />
            <Separator />

            <div>
                {query.data?.pages.map((page) => (
                    <PostList key={page.pageNumber} posts={page.items} />
                ))}
            </div>

            {query.hasNextPage && (
                <div
                    ref={ref}
                    className="min-h-[1px] flex items-center justify-center bg-transparent"
                >
                    {query.isFetchingNextPage && <Spinner />}
                </div>
            )}
        </div>
    )
}
