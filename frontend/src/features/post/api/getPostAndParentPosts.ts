import { PaginatedList, PaginationParams } from '@/types'
import { axiosInstance } from '@/lib/axios'
import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { PostBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
export const getPostAndParentPosts = async ({
    pageNumber = 1,
    pageSize = 10,
    postId,
    token,
}: PaginationParams & { postId: string; token: string }): Promise<
    PaginatedList<PostBriefResponse>
> => {
    const response = await axiosInstance.get(`posts/${postId}`, {
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

export const useGetPostAndParentPostsInfinite = (
    params: PaginationParams & { postId: string }
) => {
    const { token } = useAuth()
    const queryClient = useQueryClient()
    return useInfiniteQuery({
        queryKey: postQueryKeys.detail(params.postId),
        queryFn: ({ pageParam = 1 }) =>
            getPostAndParentPosts({
                ...params,
                pageNumber: pageParam,
                token,
            }),
        getNextPageParam: (lastPageParams) =>
            lastPageParams.hasNextPage
                ? lastPageParams.pageNumber + 1
                : undefined,
        initialPageParam: 1,

        enabled: !!params.postId && !!token,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: () => {
            // If the post is already in the cache, return it as place holder data,
            // while we fetch the actual data in the background.
            const queriesData = queryClient.getQueriesData<
                InfiniteData<PaginatedList<PostBriefResponse>>
            >({ queryKey: postQueryKeys.lists() })
            for (const [queryKey, data] of queriesData) {
                if (data) {
                    const initData = data.pages
                        .flatMap((page) => page.items)
                        .find((post) => post.id == Number(params.postId))
                    if (initData) {
                        // construct a fake paginated list with the initial data
                        return {
                            pages: [
                                {
                                    items: [initData],
                                    totalPages: 1,
                                    pageNumber: 1,
                                    totalCount: 1,
                                    hasPreviousPage: false,
                                    hasNextPage: false,
                                },
                            ],
                            pageParams: [undefined, 1],
                        }
                    }
                }
            }

            return undefined
        },
    })
}
