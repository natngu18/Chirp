import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreatePostCommand } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { postQueryKeys } from '../queries'

export const createPost = async (
    formData: FormData,
    token: string,
    postId?: string
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
    const { token } = useAuth()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: CreatePostCommand) =>
            createPost(createFormData(request), token, postId),
        onSuccess: () => {
            // Invalidate all post lists queries
            queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
        },
        onError: (error) => {},
    })
}
