import { UserResponse } from '@/features/auth/types'
import { BaseEntity, Media } from '@/types'

export interface UserBriefResponse extends BaseEntity<string> {
    username: string
    displayName: string
    avatar: Media
    isFollowing: boolean
}

export interface BaseUserDto extends BaseEntity<string> {
    username: string
    displayName: string
    avatar: Media
}

export interface UserDetailedResponse extends UserResponse {
    followersCount: number
    followingsCount: number
    backgroundImage: Media
}

export type UpdateUserCommand = {
    displayName?: string
    bio?: string
    location?: string
    avatar?: File
    backgroundImage?: File
    deleteBackgroundImage: boolean
}

export type GetTopFollowedUsersQuery = {
    userCount: number
}
