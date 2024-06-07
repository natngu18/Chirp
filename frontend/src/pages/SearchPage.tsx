import PostSearchSuggestionList from '@/features/post/components/PostSearchSuggestionList'
import { Navigate, useSearchParams } from 'react-router-dom'

export const SearchPage = () => {
    // const { token } = useAuth()
    // const params = useParams()
    const [search] = useSearchParams()
    const qParam = search.get('q')

    // const { data, isLoading } = useQuery({
    //     ...getPostsBySearchQuery({ searchText: qParam! }),
    //     enabled: !!qParam,
    // })

    if (!qParam) {
        return <Navigate to="/" replace={true} />
    }

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center w-full justify-center">
    //             <Spinner />
    //         </div>
    //     )
    // }
    // console.log('search', search)

    // console.log('data', data)

    return (
        <div className="min-h-screen flex flex-col">
            <PostSearchSuggestionList searchText={qParam} />
        </div>
    )
}
