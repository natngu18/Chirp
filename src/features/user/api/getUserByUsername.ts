import { useAuth } from '@/features/auth/context/AuthContext'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { UserDetailedResponse } from '../types'

export const getUserByUsername = async (
    username: string,
    token: string
): Promise<UserDetailedResponse> => {
    // Pass token to calculate if current user is following requested user (even though it doesn't require auth currently)
    const response = await axiosInstance.get(`/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            username,
        },
    })
    return response.data
}

// To use w/ React Router's Loader
// (loading happens outside of the React render lifecycle, so you can't use hooks)
// Need to use the query client's methods directly.
// export const getUserByUsernameQuery = (username: string, token: string) => ({
//     queryKey: ['user', username],
//     queryFn: async () => getUserByUsername(username, token),
// })

export const useGetUserByUsername = (username: string) => {
    const { token } = useAuth()
    return useQuery({
        queryKey: ['user', username],
        queryFn: async () => getUserByUsername(username, token),
        //since Firebase fetches the token async
        enabled: !!token,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
