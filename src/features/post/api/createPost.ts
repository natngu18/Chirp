import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreatePostCommand } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'
import { useToast } from '@/components/ui/use-toast'

export const createPost = async (
    formData: FormData,
    token: string,
    postId?: string // If postId is provided, it means we are creating a comment
): Promise<string> => {
    let route = `/posts`
    if (postId) {
        route = `/posts/${postId}`
    }
    const response = await axiosInstance.post(route, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}
function createFormData(request: CreatePostCommand): FormData {
    const formData = new FormData()
    formData.append('Text', request.text)
    if (request.parentPostId) {
        formData.append('ParentPostId', request.parentPostId.toString())
    }
    request.medias.forEach((media) => {
        formData.append(`Medias`, media)
    })
    return formData
}

export const useCreatePost = (postId?: string) => {
    const { token, appUser } = useAuth()
    const { toast } = useToast()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: CreatePostCommand) =>
            createPost(createFormData(request), token, postId),
        onSuccess: async () => {
            // Invalidate all post lists queries
            await queryClient.invalidateQueries({
                queryKey: postQueryKeys.lists(),
                exact: false,
                refetchType: 'all', // by default invalidateQueries() only forces refetch for active queries
            })
            if (appUser && appUser.username) {
                queryClient.invalidateQueries({
                    queryKey: postQueryKeys.userPostMedias(appUser.username),
                    refetchType: 'inactive', // by default invalidateQueries() only forces refetch for active queries
                })
            }
        },
        onError: () => {
            toast({
                title: 'An error occurred',
                description: 'Failed to create post',
            })
        },
    })
}
