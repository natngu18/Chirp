import { PostBriefResponse } from '../types'
import { useNavigate } from 'react-router'
import UserHoverCardTrigger from '@/features/user/components/UserHoverCardTrigger'
import { Link } from 'react-router-dom'
import { formatPostUtcDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import LikeButton from '@/features/like/components/LikeButton'
import { forwardRef } from 'react'
import CommentButton from './CommentButton'
import PostImageGallery from '@/features/image/components/PostImageGallery'
import Image from '@/features/image/components/Image'
import { motion } from 'framer-motion'

type Props = {
    post: PostBriefResponse
    linkDirection?: 'up' | 'down' | 'full'
    separator?: boolean
    // Specifically set to false when in image modal view
    displayImages?: boolean
    // No need to have a link for post item when in post detail view
    disablePostLink?: boolean
}
const variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

const PostItem = forwardRef<HTMLSpanElement, Props>(
    (
        {
            post,
            linkDirection,
            separator,
            displayImages = true,
            disablePostLink = false,
        },
        ref
    ) => {
        const navigate = useNavigate()

        return (
            <motion.div
                key={post.id}
                variants={variants}
                initial="hidden"
                animate="show"
            >
                {/* // fake outer link for card body */}
                <span
                    ref={ref}
                    key={post.id}
                    onClick={(e) => {
                        // prevent parent link from triggering
                        e.stopPropagation()
                        e.preventDefault()
                        if (disablePostLink) return
                        navigate(`/post/${post.id}`)
                    }}
                    data-href={`/profile/${post.id}`}
                    tabIndex={0}
                    role="link"
                    className={`${
                        disablePostLink ? `` : `hover:cursor-pointer`
                    }`}
                >
                    <Card
                        className={`px-2 flex gap-2 border-0 ${
                            separator ? `border-b-[1px]` : ``
                        } rounded-none ${
                            disablePostLink ? '' : 'hover:bg-slate-50'
                        }  w-full h-full shadow-none`}
                    >
                        {/* User avatar and reply linking bar */}
                        <div className="relative flex flex-col items-center gap-1">
                            {/* Linking bar up */}
                            {(linkDirection === 'up' ||
                                linkDirection === 'full') && (
                                <div className="absolute bg-gray-300 w-1 rounded-b-full h-3"></div>
                            )}
                            <div className="pt-4">
                                {/* User Profile Image */}
                                <UserHoverCardTrigger
                                    username={post.author.username}
                                >
                                    <Link
                                        to={`/profile/${post.author.username}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Image
                                            className="h-10 w-10 clickable-object"
                                            src={post.author.avatar.url}
                                            alt={post.author.username}
                                            rounded={true}
                                        />
                                    </Link>
                                </UserHoverCardTrigger>
                            </div>

                            {/* Linking bar down */}
                            {(linkDirection === 'down' ||
                                linkDirection === 'full') && (
                                <div className=" bg-gray-300  w-1 rounded-t-full h-full"></div>
                            )}
                        </div>

                        {/* Tweet and user info */}
                        {/* padding should be same as avatar for symmetric */}
                        <div className="py-4 text-sm flex gap-1 flex-col w-full">
                            {/* Userinfo and date */}
                            <div className="flex  gap-1 items-center flex-wrap text-wrap  w-full overflow-hidden">
                                <UserHoverCardTrigger
                                    username={post.author.username}
                                >
                                    <Link
                                        to={`/profile/${post.author.username}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="truncate"
                                    >
                                        <span className="font-semibold hover:underline">
                                            {post.author.displayName}
                                        </span>
                                    </Link>
                                </UserHoverCardTrigger>
                                <Link
                                    to={`/profile/${post.author.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="truncate"
                                >
                                    <span className=" text-gray-500">
                                        @{post.author.username}
                                    </span>
                                </Link>
                                <span className="flex items-center gap-1 text-md text-gray-500  ">
                                    • {formatPostUtcDate(post.createdAt)}
                                </span>
                            </div>
                            {post.parentPostAuthorUsername && (
                                <div>
                                    <span className="text-gray-500">
                                        Replying to {''}
                                    </span>
                                    <UserHoverCardTrigger
                                        username={post.parentPostAuthorUsername}
                                    >
                                        <Link
                                            to={`/profile/${post.parentPostAuthorUsername}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="font-semibold text-blue-500 hover:underline">
                                                {post.parentPostAuthorUsername}
                                            </span>
                                        </Link>
                                    </UserHoverCardTrigger>
                                </div>
                            )}

                            <div>
                                {/* Highlighted post text from query */}
                                <p className="line-clamp-3">
                                    <span
                                        aria-label="Post text"
                                        dangerouslySetInnerHTML={{
                                            __html: post.text,
                                        }}
                                    />
                                </p>
                            </div>

                            {/* post images */}
                            {post.medias?.length > 0 && displayImages && (
                                <PostImageGallery
                                    images={post.medias}
                                    postId={post.id.toString()}
                                />
                            )}

                            <div className="flex gap-6 items-center">
                                <CommentButton
                                    postId={post.id.toString()}
                                    commentCount={post.childCount}
                                />
                                <LikeButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                    postId={post.id.toString()}
                                    isLiked={post.isLiked}
                                    likeCount={post.likeCount}
                                />
                            </div>
                        </div>
                    </Card>
                </span>
            </motion.div>
        )
    }
)
export default PostItem
