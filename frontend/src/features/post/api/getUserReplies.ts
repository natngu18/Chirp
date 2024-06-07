import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
export const getUserReplies = async ({
    pageNumber = 1,
    pageSize = 10,
    username,
    token,
}: PaginationParams & { username: string; token: string }): Promise<
    PaginatedList<PostBriefResponse>
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
        // queryKey: ['userReplies', params.username],
        queryKey: postQueryKeys.userReplies(params.username),
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
