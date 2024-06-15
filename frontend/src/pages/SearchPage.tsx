import StickyHeader from '@/components/StickyHeader'
import { PostSearchSuggestionsList } from '../features/post/components/PostSearchSuggestionsList'
import { Searchbar } from '@/features/search/components/Searchbar'
import { useNavigate } from 'react-router'

type Props = {}

export const SearchPage = ({}: Props) => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col">
            <StickyHeader
                className=" justify-normal w-full p-2 pr-10"
                backButtonAction={() => navigate(-1)}
            >
                <Searchbar />
            </StickyHeader>
            <PostSearchSuggestionsList />
        </div>
    )
}

export default SearchPage
