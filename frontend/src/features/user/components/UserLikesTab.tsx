import { Spinner } from '@/components/Spinner'
import { useGetUserLikedPostsInfinite } from '@/features/post/api/getUserLikedPosts'
import PostList from '@/features/post/components/PostList'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
    username: string
}

function UserLikesTab({ username }: Props) {
    const query = useGetUserLikedPostsInfinite({ username })
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
            <div
                ref={ref}
                className="min-h-[1px] flex items-center justify-center bg-transparent"
            >
                {query.isFetchingNextPage && <Spinner />}
                {!query.hasNextPage && <div>No more results</div>}
            </div>
        </>
    )
}

export default UserLikesTab
