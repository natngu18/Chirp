import { axiosInstance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { GetTopFollowedUsersQuery, UserBriefResponse } from '../types'
import { useAuth } from '@/features/auth/context/AuthContext'
import { userQueryKeys } from '../queries'
export const getTopFollowedUsers = async (
    params: GetTopFollowedUsersQuery,
    token: string
): Promise<UserBriefResponse[]> => {
    const response = await axiosInstance.get('users/top-followed', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            userCount: params.userCount,
        },
    })
    return response.data
}

export const useGetTopFollowedUsers = (params: GetTopFollowedUsersQuery) => {
    const { token } = useAuth()

    return useQuery({
        queryKey: userQueryKeys.topUsers(),
        queryFn: () => getTopFollowedUsers(params, token),
        refetchOnWindowFocus: false,
        enabled: !!token,
        refetchOnMount: false,
    })
}
