import { BaseUserDto } from '@/features/user/types'
import { Media } from '@/types'

export type CreatePostCommand = {
    text: string
    parentPostId?: number
    medias: File[]
}

export type PostBriefResponse = {
    // id: number
    id: string
    text: string
    author: BaseUserDto
    createdAt: string
    media: Media[]
    parentPostAuthorUsername?: string
    childCount: number
    isLiked: boolean
    likeCount: number
}

export type ParentAndReplyResponse = {
    userReply: PostBriefResponse
    parentPost: PostBriefResponse
}

// we have multiple sources where posts are retrieved from backend,
// therefore their cache keys are different.
// This can be used to update React-query cache accordingly for optimistic updates
export type PostSource = 'feed' | 'profile' | 'search' | 'profile-replies'
export type PostInfo = {
    source: PostSource
    // Source id is the username for profile, and search text for search
    // it is the identifier for query cache for posts
    sourceId: string
}
