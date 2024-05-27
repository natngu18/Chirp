import { useGetPostsBySearchInfinite } from '../api/getPostsBySearch'
import { Spinner } from '@/components/Spinner'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import PostList from './PostList'

type Props = {
    searchText: string
}

function PostSearchSuggestionList({ searchText }: Props) {
    const query = useGetPostsBySearchInfinite({ searchText })
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

    if (query.data?.pages[0].items.length === 0) {
        return (
            <div className="flex flex-col items-center w-full justify-center p-8">
                <h1 className="text-2xl font-bold">
                    No results for "{searchText}"
                </h1>
                <span className="text-gray-500">
                    Try searching for something else.
                </span>
            </div>
        )
    }

    return (
        <div>
            {query.data?.pages.map((page) => (
                <PostList key={page.pageNumber} posts={page.items} />
            ))}
            <div
                ref={ref}
                className="min-h-[1px] flex items-center justify-center bg-transparent"
            >
                {query.isFetchingNextPage && <Spinner />}
            </div>
        </div>
    )
}

export default PostSearchSuggestionList
