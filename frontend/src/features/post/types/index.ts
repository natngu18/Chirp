import { BaseUserDto } from '@/features/user/types'
import { Media } from '@/types'

export type CreatePostCommand = {
    text: string
    parentPostId?: number
    medias: File[]
}

export type PostBriefResponse = {
    id: number
    // id: string
    text: string
    author: BaseUserDto
    createdAt: string
    medias: Media[]
    parentPostAuthorUsername?: string
    childCount: number
    isLiked: boolean
    likeCount: number
}

export type ParentAndReplyResponse = {
    userReply: PostBriefResponse
    parentPost: PostBriefResponse
}

export type PostMediasResponse = {
    postId: number
    medias: Media[]
}
