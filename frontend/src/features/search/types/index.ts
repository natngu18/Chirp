import { UserBriefResponse } from '@/features/user/types'

export type GetSearchSuggestionsQuery = {
    searchText: string
    userSuggestionsCount: number
}

export type SearchSuggestionsResponse = {
    users: UserBriefResponse[]
}
