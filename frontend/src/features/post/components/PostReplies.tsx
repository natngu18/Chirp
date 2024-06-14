import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useGetPostRepliesInfinite } from '../api/getPostReplies'
import { Spinner } from '@/components/Spinner'
import PostList from './PostList'

type Props = {
    postId: string
}

function PostReplies({ postId }: Props) {
    const query = useGetPostRepliesInfinite({ postId })
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
        <div>
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
        </div>
    )
}

export default PostReplies
