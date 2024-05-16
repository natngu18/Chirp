import { axiosInstance } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { CreatePostCommand } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'

// Will return the user's uniquely generated username
export const createPost = async (
    formData: FormData,
    token: string
): Promise<string> => {
    const response = await axiosInstance.post(`/posts`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data
}
function createFormData(request: CreatePostCommand): FormData {
    console.log('request: ', request)
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

export const useCreatePost = () => {
    const { token } = useAuth()
    return useMutation({
        mutationFn: (request: CreatePostCommand) =>
            createPost(createFormData(request), token),
        onSuccess: (data) => {
            console.log('create post data', data)
        },
        onError: (error) => {
            console.log('create error: ', error)
        },
    })
}
