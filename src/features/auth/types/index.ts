import { BaseEntity, Media } from '@/types'

export type CreateUserCommand = {
    id: string
    email: string
}

export interface UserResponse extends BaseEntity<string> {
    username: string
    location?: string
    bio?: string
    avatar?: Media
    displayName: string
}
