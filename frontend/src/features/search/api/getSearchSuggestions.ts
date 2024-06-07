import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { GetSearchSuggestionsQuery, SearchSuggestionsResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
export const getSearchSuggestions = async (
    params: GetSearchSuggestionsQuery,
    token: string
): Promise<SearchSuggestionsResponse> => {
    // Pass token to calculate if current user is following requested user (even though it doesn't require auth currently)
    const response = await axiosInstance.get('search/suggestions', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            searchText: params.searchText,
            userSuggestionsCount: params.userSuggestionsCount,
        },
    })
    return response.data
}

export const useGetSearchSuggestions = (params: GetSearchSuggestionsQuery) => {
    const { token } = useAuth()

    return useQuery({
        queryKey: ['searchSuggestions', params],
        queryFn: () => getSearchSuggestions(params, token),
        enabled: !!params.searchText && !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
