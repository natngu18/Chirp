import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { UserResponse } from '../types'

// Only used for auth purposes right now...
export const getUserById = async (userId: string): Promise<UserResponse> => {
    const response = await axiosInstance.get(`/users/${userId}`)

    return response.data
}

export const useGetUserById = (userId: string, isEnabled: boolean = true) => {
    return useQuery({
        queryFn: () => getUserById(userId),
        queryKey: ['user', userId],
        enabled: !!userId && isEnabled,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
