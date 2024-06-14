import { useGetPostsBySearchInfinite } from '../features/post/api/getPostsBySearch'
import { Spinner } from '@/components/Spinner'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import PostList from '../features/post/components/PostList'
import { Navigate, useSearchParams } from 'react-router-dom'

export const PostSearchSuggestionPage = () => {
    const [search] = useSearchParams()
    const qParam = search.get('q')
    const query = useGetPostsBySearchInfinite({ searchText: qParam })
    const { ref, inView } = useInView()
    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage()
        }
    }, [inView, query])

    // redirect to home if no search query
    if (!qParam) {
        return <Navigate to="/" replace={true} />
    }
    if (query.isLoading) {
        return (
            <div className="flex items-center w-full justify-center">
                <Spinner />
            </div>
        )
    }

    if (query.data?.pages[0].items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center w-full  p-8">
                <h1 className="text-2xl font-bold">
                    No results for "{qParam}"
                </h1>
                <span className="text-gray-500">
                    Try searching for something else.
                </span>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
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
