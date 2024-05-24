import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import {
    InfiniteData,
    QueryKey,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { PaginatedList } from '@/types'
import {
    ParentAndReplyResponse,
    PostBriefResponse,
} from '@/features/post/types'

export const deleteLike = async (postId: string): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.delete(`/posts/${postId}/likes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export const useDeleteLike = (postId: string, queryKey: QueryKey) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => deleteLike(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: queryKey,
            })

            // post reply and parent post are different object from PostBriefResponse,
            // so they need to be handled separately
            if (queryKey[0] === 'userReplies') {
                const previousResults =
                    queryClient.getQueryData<
                        InfiniteData<PaginatedList<ParentAndReplyResponse>>
                    >(queryKey)
                // Optimistically update to the new value
                if (previousResults) {
                    queryClient.setQueryData(queryKey, {
                        ...previousResults,
                        pages: previousResults.pages.map((page) => ({
                            ...page,
                            items: page.items.map((response) => {
                                const isUserReply =
                                    response.userReply.id === postId
                                const isParentPost =
                                    response.parentPost.id === postId

                                return {
                                    ...response,
                                    userReply: isUserReply
                                        ? {
                                              ...response.userReply,
                                              isLiked: false,
                                              likeCount:
                                                  response.userReply.likeCount -
                                                  1,
                                          }
                                        : response.userReply,
                                    parentPost: isParentPost
                                        ? {
                                              ...response.parentPost,
                                              isLiked: false,
                                              likeCount:
                                                  response.parentPost
                                                      .likeCount - 1,
                                          }
                                        : response.parentPost,
                                }
                            }),
                        })),
                    })
                }
                // Return a context with the previous user
                return { previousResults }
            }
            const previousResults =
                queryClient.getQueryData<
                    InfiniteData<PaginatedList<PostBriefResponse>>
                >(queryKey)
            // Optimistically update to the new value
            if (previousResults) {
                queryClient.setQueryData(queryKey, {
                    ...previousResults,
                    pages: previousResults.pages.map((page) => ({
                        ...page,
                        items: page.items.map((post) =>
                            post.id === postId
                                ? {
                                      ...post,
                                      isLiked: false,
                                      likeCount: post.likeCount - 1,
                                  }
                                : post
                        ),
                    })),
                })
            }
            // Return a context with the previous user
            return { previousResults }
        },
        onError: (err, newUser, context) => {
            // If there was a previous user, set it back to the previous value
            if (context?.previousResults) {
                queryClient.setQueryData(queryKey, context.previousResults)
            }
            queryClient.invalidateQueries({
                queryKey: queryKey,
            })
        },
        // Always refetch after error or success:
        // onSettled: () => {
        //     queryClient.invalidateQueries({
        //         queryKey: ['postSearchResults', searchText],
        //     })
        // },
    })
}
