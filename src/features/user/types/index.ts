import { BaseEntity, Media } from '@/types'

export interface UserBriefResponse extends BaseEntity<string> {
    username: string
    displayName: string
    avatar: Media
}
