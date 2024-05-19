import { UserResponse } from '@/features/auth/types'
import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

// TODO test this w/ react router laoder....
export const getUserByUsername = async (
    username: string
): Promise<UserResponse> => {
    const response = await axiosInstance.get(`/users`, {
        params: {
            username,
        },
    })
    return response.data
}

// To use w/ React Router's Loader
// (loading happens outside of the React render lifecycle, so you can't use hooks)
// Need to use the query client's methods directly.
export const getUserByUsernameQuery = (username: string) => ({
    queryKey: ['user', username],
    queryFn: async () => getUserByUsername(username),
})

export const useGetUserByUsername = (username: string) => {
    return useQuery(getUserByUsernameQuery(username))
}
