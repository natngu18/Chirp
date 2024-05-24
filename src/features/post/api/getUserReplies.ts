import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ParentAndReplyResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
export const getUserReplies = async ({
    pageNumber = 1,
    pageSize = 5,
    username,
    token,
}: PaginationParams & { username: string; token: string }): Promise<
    PaginatedList<ParentAndReplyResponse>
> => {
    const response = await axiosInstance.get(`users/${username}/replies`, {
        // Attach token to calculate if current user has liked the post
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pageNumber,
            pageSize,
        },
    })
    return response.data
}

export const useGetUserRepliesInfinite = (
    params: PaginationParams & { username: string }
) => {
    const { token } = useAuth()
    return useInfiniteQuery({
        queryKey: ['userReplies', params.username],
        queryFn: ({ pageParam = 1 }) =>
            getUserReplies({ ...params, pageNumber: pageParam, token }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,
        enabled: !!params.username && !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
