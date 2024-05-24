import React from 'react'
import { useCreateLike } from '../api/createLike'
import { PostInfo } from '@/features/post/types'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { motion } from 'framer-motion'
import { useDeleteLike } from '../api/deleteLike'

interface Props {
    // we have multiple sources where posts are retrieved from backend,
    // and we need to update React-query cache accordingly for optimistic update
    postId: string
    // Should not be null when source is 'search'
    // searchTextParam?: string
    postInfo: PostInfo
    isLiked: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function LikeButton({
    postId,
    // searchTextParam,
    postInfo,
    isLiked,
    onClick,
}: Props) {
    // For optimistic update.
    const queryKey =
        postInfo.source === 'search'
            ? ['postSearchResults', postInfo.sourceId]
            : postInfo.source === 'profile'
            ? ['userPosts', postInfo.sourceId]
            : postInfo.source === 'profile-replies'
            ? ['userReplies', postInfo.sourceId]
            : ['feed']

    console.log(queryKey)
    // TODO: don't hardcode query keys
    // TODO: could be refactored to use a single mutation function
    const { mutate: like } = useCreateLike(postId, queryKey)

    // todo implememt for profile
    const { mutate: unlike } = useDeleteLike(postId, queryKey)
    const handleLikeButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLiked) {
            unlike()
        } else if (!isLiked) {
            like()
        }
        if (onClick) onClick(e)
    }
    const variants = {
        tap: { scale: 0.8 },
        hover: { scale: 1.2 },
    }

    return (
        <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={variants}
            onClick={(e) => handleLikeButtonClick(e)}
        >
            {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
        </motion.button>
    )
}

export default LikeButton
