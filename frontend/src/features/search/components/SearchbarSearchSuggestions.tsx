import { GetSearchSuggestionsQuery } from '../types'
import useDebounce from '@/hooks/useDebounce'
import { useGetSearchSuggestions } from '../api/getSearchSuggestions'
import { CommandGroup, CommandItem } from '@/components/ui/command'
import UserSearchSuggestionItem from '@/features/user/components/UserSearchSuggestionItem'
import { Link, createSearchParams } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'
type Props = {
    suggestionParams: GetSearchSuggestionsQuery
    onSuggestionSelect?: () => void
}

function SearchbarSearchSuggestions({
    suggestionParams,
    onSuggestionSelect,
}: Props) {
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
                    asChild
                    onSelect={() => {
                        if (onSuggestionSelect) onSuggestionSelect()
                    }}
                >
                    <Link
                        to={`/search?${createSearchParams({
                            q: suggestionParams.searchText,
                        }).toString()}`}
                    >{`Search for "${suggestionParams.searchText}"`}</Link>
                </CommandItem>
            )}

            {/* Display user search suggestions */}
            {getSearchSuggestionsQuery.data &&
                getSearchSuggestionsQuery.data.users.map((user) => (
                    <CommandItem
                        className="hover:cursor-pointer"
                        key={user.id}
                        asChild
                        value={user.username}
                        onSelect={(selectedUsername) => {
                            // navigate(`/profile/${selectedUsername}`)
                            if (onSuggestionSelect) onSuggestionSelect()
                        }}
                    >
                        <Link to={`/profile/${user.username}`}>
                            <UserSearchSuggestionItem user={user} />
                        </Link>
                    </CommandItem>
                ))}
        </CommandGroup>
    )
}

export default SearchbarSearchSuggestions
