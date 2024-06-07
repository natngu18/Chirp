import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
export const getPostReplies = async ({
    pageNumber = 1,
    pageSize = 10,
    postId,
    token,
}: PaginationParams & { postId: string; token: string }): Promise<
    PaginatedList<PostBriefResponse>
> => {
    const response = await axiosInstance.get(`posts/${postId}/replies`, {
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

export const useGetPostRepliesInfinite = (
    params: PaginationParams & { postId: string }
) => {
    const { token } = useAuth()
    return useInfiniteQuery({
        queryKey: postQueryKeys.postReplies(params.postId),
        queryFn: ({ pageParam = 1 }) =>
            getPostReplies({ ...params, pageNumber: pageParam, token }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,
        enabled: !!params.postId && !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
