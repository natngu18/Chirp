import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

import { createSearchParams, useNavigate } from 'react-router-dom'
import { useGetSearchSuggestions } from '../api/getSearchSuggestions'
import { useRef, useState } from 'react'
import { GetSearchSuggestionsQuery } from '../types'
import useDebounce from '@/hooks/useDebounce'
import { Spinner } from '@/components/Spinner'
import UserSearchSuggestionItem from '@/features/user/components/UserSearchSuggestionItem'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import CircularButton from '@/components/CircularButton'
import { XIcon } from 'lucide-react'

const USER_SUGGESTIONS_COUNT = 5

export const Searchbar = () => {
    const [suggestionParams, setSuggestionParams] =
        useState<GetSearchSuggestionsQuery>({
            searchText: '',
            userSuggestionsCount: USER_SUGGESTIONS_COUNT,
        })

    const ref = useOutsideClick(() => {
        setOpen(false)
    })

    const debouncedSearch = useDebounce(suggestionParams, 500)
    // Disabled when search text is empty string
    const getSearchSuggestionsQuery = useGetSearchSuggestions(debouncedSearch)
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setSuggestionParams({
            ...suggestionParams,
            searchText: e.currentTarget.value,
        })
    }
    const inputRef = useRef<HTMLInputElement>(null)

    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    return (
        <div ref={ref}>
            <div className="flex flex-col md:flex-row gap-3 ">
                <Command className="relative flex justify-center items-between overflow-visible  rounded-full bg-gray-200 ">
                    <CommandInput
                        ref={inputRef}
                        className="font-semibold h-[50px] text-md"
                        placeholder="Search"
                        value={suggestionParams.searchText}
                        onChangeCapture={handleInput}
                        onFocus={() => {
                            setOpen(true)
                        }}
                    />

                    {suggestionParams.searchText && (
                        <CircularButton
                            className="absolute right-2"
                            onClick={() => {
                                setSuggestionParams({
                                    ...suggestionParams,
                                    searchText: '',
                                })
                                // Focus on input after clearing
                                if (inputRef.current) inputRef.current.focus()
                            }}
                        >
                            <XIcon size={20} />
                        </CircularButton>
                    )}

                    {/* Display search results only when focused */}
                    {open && (
                        <div className="relative">
                            {getSearchSuggestionsQuery.isLoading && (
                                <div className="absolute w-full flex items-center justify-center pt-2">
                                    <Spinner />
                                </div>
                            )}

                            <CommandList className="absolute bg-white z-50 w-full flex flex-col shadow-xl rounded-md">
                                {/* Link to specific search */}
                                {suggestionParams.searchText &&
                                    getSearchSuggestionsQuery.data && (
                                        <CommandGroup>
                                            <CommandItem
                                                className="text-md hover:cursor-pointer"
                                                onSelect={() => {
                                                    navigate({
                                                        pathname: '/search',
                                                        search: createSearchParams(
                                                            {
                                                                q: suggestionParams.searchText,
                                                            }
                                                        ).toString(),
                                                    })
                                                }}
                                            >
                                                {`Search for "${suggestionParams.searchText}"`}
                                            </CommandItem>
                                        </CommandGroup>
                                    )}

                                {/* Display user search suggestions */}
                                {getSearchSuggestionsQuery.data && (
                                    <CommandGroup>
                                        {getSearchSuggestionsQuery.data?.users.map(
                                            (user) => (
                                                <CommandItem
                                                    className="hover:cursor-pointer"
                                                    key={user.id}
                                                    value={user.username}
                                                    onSelect={(
                                                        selectedUsername
                                                    ) => {
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
                        </div>
                    )}
                </Command>
            </div>
        </div>
    )
}
