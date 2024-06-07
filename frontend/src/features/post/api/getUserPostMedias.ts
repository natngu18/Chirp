import { axiosInstance } from '@/lib/axios'
import { PaginatedList, PaginationParams } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { postQueryKeys } from '../queries'
import { PostMediasResponse } from '../types'
export const getUserPostMedias = async ({
    pageNumber = 1,
    pageSize = 3, // should be multiple of 3
    username,
}: PaginationParams & { username: string }): Promise<
    PaginatedList<PostMediasResponse>
> => {
    const response = await axiosInstance.get(`users/${username}/posts/medias`, {
        params: {
            pageNumber,
            pageSize,
        },
    })
    return response.data
}

export const useGetUserPostMediasInfinite = (
    params: PaginationParams & { username: string }
) => {
    return useInfiniteQuery({
        queryKey: postQueryKeys.userPostMedias(params.username),
        queryFn: ({ pageParam = 1 }) =>
            getUserPostMedias({ ...params, pageNumber: pageParam }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,
        enabled: !!params.username,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
