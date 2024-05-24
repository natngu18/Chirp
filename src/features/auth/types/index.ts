import { UserBriefResponse } from '@/features/user/types'

export type CreateUserCommand = {
    id: string
    email: string
}

export interface UserResponse extends UserBriefResponse {
    location?: string
    bio?: string
}
