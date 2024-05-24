import { Spinner } from '@/components/Spinner'
import { useGetUserRepliesInfinite } from '@/features/post/api/getUserReplies'
import ReplyList from '@/features/post/components/ReplyList'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
    username: string
}

function UserRepliesTab({ username }: Props) {
    const query = useGetUserRepliesInfinite({ username })
    console.log('username', username)
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
                <ReplyList
                    key={page.pageNumber}
                    parentPostsAndReplies={page.items}
                    postInfo={{ source: 'profile-replies', sourceId: username }}
                />
                // <PostList
                //     key={page.pageNumber}
                //     posts={page.items}
                //     postInfo={{ source: 'profile', sourceId: username }}
                //     // source="profile"
                // />
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

export default UserRepliesTab
