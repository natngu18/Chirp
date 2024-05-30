import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import {
    InfiniteData,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { PaginatedList } from '@/types'
import { PostBriefResponse } from '@/features/post/types'
import { postQueryKeys } from '@/features/post/queries'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/features/auth/context/AuthContext'

export const createLike = async (postId: string): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.post(`/posts/${postId}/likes`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}
export const deleteLike = async (postId: string): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.delete(`/posts/${postId}/likes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export const useLike = (postId: string) => {
    const queryClient = useQueryClient()
    const { appUser } = useAuth()
    const { toast } = useToast()
    return useMutation({
        mutationFn: (action: 'like' | 'unlike') =>
            action === 'like' ? createLike(postId) : deleteLike(postId),
        onMutate: async (action) => {
            await queryClient.cancelQueries({
                queryKey: postQueryKeys.lists(),
            })
            // Update query cache for all post lists (partial query key match)
            queryClient.setQueriesData(
                { queryKey: postQueryKeys.lists(), exact: false },
                (
                    oldData:
                        | InfiniteData<PaginatedList<PostBriefResponse>>
                        | undefined
                ) => {
                    // If oldData is undefined, return undefined
                    if (!oldData) {
                        return undefined
                    }
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            items: page.items.map((post) =>
                                post.id == Number(postId)
                                    ? {
                                          ...post,
                                          isLiked: action === 'like',
                                          likeCount:
                                              post.likeCount +
                                              (action === 'like' ? 1 : -1),
                                      }
                                    : post
                            ),
                        })),
                    }
                }
            )
        },
        onSuccess: () => {
            // Invalidate current user's liked posts when like/unlike is successful
            if (appUser && appUser.username) {
                queryClient.invalidateQueries({
                    queryKey: postQueryKeys.userLikedPosts(appUser.username),
                    refetchType: 'inactive', // by default invalidateQueries() only forces refetch for active queries
                })
            }
        },
        onError: () => {
            queryClient.invalidateQueries({
                queryKey: postQueryKeys.lists(),
                type: 'inactive',
            })
            toast({
                title: 'An error occurred',
                description: 'Something went wrong',
                variant: 'destructive',
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
