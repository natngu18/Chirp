import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { createSearchParams, useNavigate } from 'react-router-dom'
import { useGetSearchSuggestions } from '../api/getSearchSuggestions'
import { useState } from 'react'
import { GetSearchSuggestionsQuery } from '../types'
import useDebounce from '@/hooks/useDebounce'
import { Spinner } from '@/components/Spinner'
import UserSearchSuggestionItem from '@/features/user/components/UserSearchSuggestionItem'

const USER_SUGGESTIONS_COUNT = 5

export const Searchbar = () => {
    const [suggestionParams, setSuggestionParams] =
        useState<GetSearchSuggestionsQuery>({
            searchText: '',
            userSuggestionsCount: USER_SUGGESTIONS_COUNT,
        })

    const debouncedSearch = useDebounce(suggestionParams, 500)
    // Disabled when search text is empty string
    const getSearchSuggestionsQuery = useGetSearchSuggestions(debouncedSearch)
    console.log('data', getSearchSuggestionsQuery.data)
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setSuggestionParams({
            ...suggestionParams,
            searchText: e.currentTarget.value,
        })
    }

    const navigate = useNavigate()

    return (
        <div className="border border-red-500">
            <div className="flex flex-col md:flex-row gap-3 ">
                <Command>
                    <CommandInput
                        className="font-semibold h-[50px] text-xl"
                        placeholder="Search for an address..."
                        value={suggestionParams.searchText}
                        onChangeCapture={handleInput}
                    />
                    {getSearchSuggestionsQuery.isLoading && (
                        <div className="flex items-center justify-center">
                            <Spinner />
                        </div>
                    )}
                    <CommandList>
                        {suggestionParams.searchText &&
                            getSearchSuggestionsQuery.data && (
                                // Onclick redirect to search page w/ approriate seach query
                                <CommandGroup>
                                    <CommandItem
                                        className="text-md hover:cursor-pointer"
                                        onSelect={() => {
                                            navigate({
                                                pathname: '/search',
                                                search: createSearchParams({
                                                    q: suggestionParams.searchText,
                                                }).toString(),
                                                // search: `?q=${suggestionParams.searchText}`,
                                            })
                                        }}
                                    >
                                        {`Search for "${suggestionParams.searchText}"`}
                                    </CommandItem>
                                </CommandGroup>
                            )}

                        {getSearchSuggestionsQuery.data && (
                            <CommandGroup>
                                {getSearchSuggestionsQuery.data?.users.map(
                                    (user) => (
                                        <CommandItem
                                            className="hover:cursor-pointer"
                                            key={user.id}
                                            value={user.username}
                                            onSelect={(selectedUsername) => {
                                                navigate(
                                                    `/profile/${selectedUsername}`
                                                )
                                            }}
                                        >
                                            <UserSearchSuggestionItem
                                                user={user}
                                            />
                                        </CommandItem>
                                    )
                                )}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </div>
        </div>
    )
}
