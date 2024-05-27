import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
export const getPostsBySearch = async ({
    pageNumber = 1,
    pageSize = 5,
    searchText,
    token,
}: PaginationParams & { searchText: string; token: string }): Promise<
    PaginatedList<PostBriefResponse>
> => {
    const response = await axiosInstance.get('posts', {
        // Attach token to calculate if current user has liked the post
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pageNumber,
            pageSize,
            searchText,
        },
    })
    return response.data
}

export const useGetPostsBySearchInfinite = (
    params: PaginationParams & { searchText: string }
) => {
    const { token } = useAuth()
    return useInfiniteQuery({
        // queryKey: ['postSearchResults', params.searchText],
        queryKey: postQueryKeys.searchResults(params.searchText),
        queryFn: ({ pageParam = 1 }) =>
            getPostsBySearch({ ...params, pageNumber: pageParam, token }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,
        enabled: !!params.searchText && !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
