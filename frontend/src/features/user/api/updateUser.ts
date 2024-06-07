import { UpdateUserCommand } from './../types/index'
import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const updateUser = async (
    formData: FormData,
    username: string
): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.patch(`/users/${username}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

function createFormData(request: UpdateUserCommand): FormData {
    const formData = new FormData()
    if (request.avatar) formData.append('Avatar', request.avatar)
    if (request.backgroundImage)
        formData.append('BackgroundImage', request.backgroundImage)
    if (request.bio) formData.append('Bio', request.bio)
    if (request.displayName) formData.append('DisplayName', request.displayName)
    if (request.location) formData.append('Location', request.location)
    if (request.deleteBackgroundImage)
        formData.append('DeleteBackgroundImage', 'true')
    return formData
}

export const useUpdateUser = (username: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (request: UpdateUserCommand) =>
            updateUser(createFormData(request), username),
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user', username] })
        },
    })
}
