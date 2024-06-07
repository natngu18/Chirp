import { Spinner } from '@/components/Spinner'
import PostMediasItem from '@/features/image/components/PostMediasItem'
import { useGetUserPostMediasInfinite } from '@/features/post/api/getUserPostMedias'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
    username: string
}

function UserMediasTab({ username }: Props) {
    const query = useGetUserPostMediasInfinite({ username })
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
        <div className="p-1">
            <div className="grid grid-cols-3 gap-1">
                {query.data?.pages.map((page) =>
                    page.items.map((postMedias) => (
                        <PostMediasItem
                            key={postMedias.postId}
                            images={postMedias.medias}
                            postId={postMedias.postId.toString()}
                        />
                    ))
                )}
            </div>

            <div
                ref={ref}
                className="min-h-[1px] flex items-center justify-center bg-transparent"
            >
                {query.isFetchingNextPage && <Spinner />}
            </div>
        </div>
    )
}

export default UserMediasTab
