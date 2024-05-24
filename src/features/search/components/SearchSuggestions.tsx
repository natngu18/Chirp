import { GetSearchSuggestionsQuery } from '../types'
import useDebounce from '@/hooks/useDebounce'
import { useGetSearchSuggestions } from '../api/getSearchSuggestions'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import UserSearchSuggestionItem from '@/features/user/components/UserSearchSuggestionItem'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'
type Props = {
    suggestionParams: GetSearchSuggestionsQuery
    onSuggestionSelect?: () => void
}

function SearchSuggestions({ suggestionParams, onSuggestionSelect }: Props) {
    const navigate = useNavigate()
    const debouncedSearch = useDebounce(suggestionParams, 500)
    // Disabled when search text is empty string
    const getSearchSuggestionsQuery = useGetSearchSuggestions(debouncedSearch)
    return (
        <CommandGroup>
            {getSearchSuggestionsQuery.isLoading && (
                <CommandItem className="pointer-events-none bg-white w-full flex items-center justify-center pt-2">
                    <Spinner />
                </CommandItem>
            )}

            {/* Link to specific search */}
            {suggestionParams.searchText && getSearchSuggestionsQuery.data && (
                <CommandItem
                    className="text-md hover:cursor-pointer"
                    onSelect={() => {
                        navigate({
                            pathname: '/search',
                            search: createSearchParams({
                                q: suggestionParams.searchText,
                            }).toString(),
                        })
                        if (onSuggestionSelect) onSuggestionSelect()
                    }}
                >
                    {`Search for "${suggestionParams.searchText}"`}
                </CommandItem>
            )}

            {/* Display user search suggestions */}
            {getSearchSuggestionsQuery.data &&
                getSearchSuggestionsQuery.data.users.map((user) => (
                    <CommandItem
                        className="hover:cursor-pointer"
                        key={user.id}
                        value={user.username}
                        onSelect={(selectedUsername) => {
                            navigate(`/profile/${selectedUsername}`)
                            if (onSuggestionSelect) onSuggestionSelect()
                        }}
                    >
                        <UserSearchSuggestionItem user={user} />
                    </CommandItem>
                ))}
        </CommandGroup>
    )
}

export default SearchSuggestions
