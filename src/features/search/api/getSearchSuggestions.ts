import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { GetSearchSuggestionsQuery, SearchSuggestionsResponse } from '../types'
export const getSearchSuggestions = async (
    params: GetSearchSuggestionsQuery
): Promise<SearchSuggestionsResponse> => {
    const baseURL = axiosInstance.defaults.baseURL
    const fetchURL = new URL('api/search/suggestions', baseURL)

    fetchURL.searchParams.set('searchText', params.searchText)
    fetchURL.searchParams.set(
        'userSuggestionsCount',
        params.userSuggestionsCount.toString()
    )
    const response = await axiosInstance.get(fetchURL.href)
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
