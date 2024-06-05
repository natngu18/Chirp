import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
export const getFollowedUsersPosts = async ({
    pageNumber = 1,
    pageSize = 10,
    token,
}: PaginationParams & { token: string }): Promise<
    PaginatedList<PostBriefResponse>
> => {
    const response = await axiosInstance.get(`posts/followings`, {
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

export const useGetFollowedUsersPostsInfinite = (params: PaginationParams) => {
    const { token } = useAuth()
    return useInfiniteQuery({
        queryKey: postQueryKeys.followedUsersPosts(),
        queryFn: ({ pageParam = 1 }) =>
            getFollowedUsersPosts({ ...params, pageNumber: pageParam, token }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,
        enabled: !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
