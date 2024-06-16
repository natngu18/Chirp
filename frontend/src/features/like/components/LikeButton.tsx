import React from 'react'
import { useLike } from '../api/createAndDeleteLike'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

interface Props {
    postId: string
    isLiked: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    likeCount: number
}

function LikeButton({ postId, isLiked, onClick, likeCount }: Props) {
    const { mutate } = useLike(postId)
    const handleLikeButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isLiked) {
            mutate('unlike')
        } else if (!isLiked) {
            mutate('like')
        }
        if (onClick) onClick(e)
    }

    return (
        <button
            className="flex group items-center"
            onClick={(e) => handleLikeButtonClick(e)}
            aria-label={isLiked ? `Unlike post` : `Like post`}
        >
            <span className="group-hover:text-red-600 rounded-full p-2 group-hover:bg-red-600/10 transition-colors duration-200">
                {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
            </span>
            <span className="group-hover:text-red-600">{likeCount}</span>
        </button>
    )
}

export default LikeButton
