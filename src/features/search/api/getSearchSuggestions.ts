import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { GetSearchSuggestionsQuery, SearchSuggestionsResponse } from '../types'
export const getSearchSuggestions = async (
    params: GetSearchSuggestionsQuery
): Promise<SearchSuggestionsResponse> => {
    const response = await axiosInstance.get('search/suggestions', {
        params: {
            searchText: params.searchText,
            userSuggestionsCount: params.userSuggestionsCount,
        },
    })
    return response.data
}

export const useGetSearchSuggestions = (params: GetSearchSuggestionsQuery) => {
    return useQuery({
        queryKey: ['searchSuggestions', params],
        queryFn: () => getSearchSuggestions(params),
        enabled: !!params.searchText,
        refetchOnWindowFocus: false,
    })
}
