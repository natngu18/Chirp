import { Spinner } from '@/components/Spinner'
import { useGetUserOriginalPostsInfinite } from '@/features/post/api/getUserOriginalPosts'
import PostList from '@/features/post/components/PostList'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
    username: string
}

function UserPostsTab({ username }: Props) {
    const query = useGetUserOriginalPostsInfinite({ username })
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage()
        }
    }, [inView, query])

    if (query.isLoading) {
        return (
            <div className="flex items-center w-full justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <>
            {query.data?.pages.map((page) => (
                <PostList key={page.pageNumber} posts={page.items} />
            ))}
            {query.hasNextPage && (
                <div
                    ref={ref}
                    className="min-h-[1px] flex items-center justify-center bg-transparent"
                >
                    {query.isFetchingNextPage && <Spinner />}
                </div>
            )}
        </>
    )
}

export default UserPostsTab
