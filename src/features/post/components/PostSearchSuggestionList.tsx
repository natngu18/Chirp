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

    return (
        <>
            {query.data?.pages.map((page) => (
                <PostList
                    key={page.pageNumber}
                    posts={page.items}
                    postInfo={{ source: 'search', sourceId: searchText }}
                    // source="search"
                    // searchTextParam={searchText}
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

export default PostSearchSuggestionList
