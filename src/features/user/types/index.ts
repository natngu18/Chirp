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
}
