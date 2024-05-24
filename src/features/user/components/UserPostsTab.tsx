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
                <PostList
                    key={page.pageNumber}
                    posts={page.items}
                    postInfo={{ source: 'profile', sourceId: username }}
                    // source="profile"
                />
            ))}
            <div
                ref={ref}
                className="flex items-center justify-center bg-red-500"
            >
                {query.isFetchingNextPage && <Spinner />}
                {!query.hasNextPage && <div>No more results</div>}
            </div>
        </>
    )
}

export default UserPostsTab
