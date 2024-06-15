import { Command, CommandInput, CommandList } from '@/components/ui/command'
import { useRef, useState } from 'react'
import { GetSearchSuggestionsQuery } from '../types'
import CircularButton from '@/components/CircularButton'
import { XIcon } from 'lucide-react'
import SearchbarSearchSuggestions from './SearchbarSearchSuggestions'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useNavigate } from 'react-router'
import { createSearchParams, useSearchParams } from 'react-router-dom'
const USER_SUGGESTIONS_COUNT = 5
export const Searchbar = () => {
    const [search] = useSearchParams()
    const qParam = search.get('q')
    const [suggestionParams, setSuggestionParams] =
        useState<GetSearchSuggestionsQuery>({
            searchText: qParam ?? '',
            userSuggestionsCount: USER_SUGGESTIONS_COUNT,
        })
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const commandRef = useOutsideClick(() => {
        setOpen(false)
    })

    return (
        <div className={`flex flex-col md:flex-row gap-3 w-full`}>
            <Command
                ref={commandRef}
                //Fixes conditional rendering of loading component for SearchSuggestions
                shouldFilter={false}
                className="relative flex justify-center items-between overflow-visible  rounded-full bg-gray-200 "
            >
                {/* Searchbar input */}
                <CommandInput
                    ref={inputRef}
                    className="font-semibold h-[50px] text-md"
                    placeholder="Search"
                    value={suggestionParams.searchText}
                    onValueChange={(value) =>
                        setSuggestionParams({
                            ...suggestionParams,
                            searchText: value,
                        })
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            navigate({
                                pathname: '/search',
                                search: createSearchParams({
                                    q: suggestionParams.searchText,
                                }).toString(),
                            })
                            setOpen(false)
                            inputRef.current?.blur()
                        }
                    }}
                    // onBlur={() => setOpen(false)}
                    onFocus={() => {
                        setOpen(true)
                    }}
                />

                {/* Clear searchbar input field button */}
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
                <div className="relative">
                    <CommandList className="absolute  bg-white  w-full flex flex-col shadow-xl rounded-md">
                        {/* Display search results only when focused */}
                        {open && (
                            <SearchbarSearchSuggestions
                                suggestionParams={suggestionParams}
                                onSuggestionSelect={() => setOpen(false)}
                            />
                        )}
                    </CommandList>
                </div>
            </Command>
        </div>
    )
}
