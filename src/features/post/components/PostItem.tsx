import { PostBriefResponse, PostInfo } from '../types'
import { useNavigate } from 'react-router'
import UserHoverCardTrigger from '@/features/user/components/UserHoverCardTrigger'
import { Link } from 'react-router-dom'
import { formatPostUtcDate } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import LikeButton from '@/features/like/components/LikeButton'

type Props = {
    post: PostBriefResponse
    // Should not be null when source is 'search'
    // searchTextParam?: string
    postInfo: PostInfo
    linkDirection?: 'up' | 'down'
}

function PostItem({ post, postInfo, linkDirection }: Props) {
    const navigate = useNavigate()
    return (
        // fake outer link for card body
        <span
            key={post.id}
            onClick={(e) => {
                // prevent parent link from triggering
                e.stopPropagation()
                e.preventDefault()
                navigate(`/post/${post.author.username}`)
                // navigate('/test')
            }}
            data-href={`/profile/${post.author.username}`}
            tabIndex={0}
            role="link"
            className="hover:cursor-pointer "
        >
            <Card className="px-2 flex gap-2 border-0 rounded-none hover:bg-slate-50 w-full h-full min-h-72">
                {/* User avatar and reply linking bar */}
                <div className="relative flex flex-col items-center gap-1">
                    {/* Linking bar up */}
                    {linkDirection === 'up' && (
                        <div className=" bg-gray-300 w-1 rounded-b-full h-1/6"></div>
                    )}
                    {/* Disable top padding for user image, if column is up direction, for symmetry */}
                    <div className={linkDirection === 'up' ? `` : `pt-4`}>
                        {/* User Profile Image */}
                        <UserHoverCardTrigger username={post.author.username}>
                            <Link
                                to={`/profile/${post.author.username}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <img
                                        src={post.author.avatar.url}
                                        alt={post.author.username}
                                        referrerPolicy="no-referrer"
                                        className="aspect-square h-full w-full clickable-object"
                                    />
                                </span>
                            </Link>
                        </UserHoverCardTrigger>
                    </div>

                    {/* Linking bar down */}
                    {linkDirection === 'down' && (
                        <div className=" bg-gray-300 w-1 rounded-t-full h-full"></div>
                    )}
                </div>

                {/* Tweet and user info */}
                {/* padding should be same as avatar for symmetric */}
                <div className="py-4 text-sm flex gap-1 flex-col w-full overflow-hidden  aspect-[3/4] pr-12">
                    {/* Userinfo and date */}
                    <div className="flex  gap-1 items-center ">
                        <UserHoverCardTrigger username={post.author.username}>
                            <Link
                                to={`/profile/${post.author.username}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="font-semibold hover:underline">
                                    {post.author.displayName}
                                </span>
                            </Link>
                        </UserHoverCardTrigger>
                        <Link
                            to={`/profile/${post.author.username}`}
                            onClick={(e) => e.stopPropagation()}
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
                                dangerouslySetInnerHTML={{
                                    __html: post.text,
                                }}
                            />
                        </p>
                    </div>

                    {/* post images */}
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYc2tkZ2-6dmEYhNAKfMLXiTCdMFpS6bNcePNFXkVYMw&s"
                        alt="placeholder"
                        className="w-full object-cover h-full rounded-md"
                    />

                    <div className="flex gap-2 items-center">
                        <LikeButton
                            onClick={(e) => {
                                e.stopPropagation()
                                // handleLikeButtonClick(e)
                            }}
                            postId={post.id}
                            postInfo={postInfo}
                            // searchTextParam={searchTextParam}
                            isLiked={post.isLiked}
                        />
                        <div>
                            <span className="text-gray-500">
                                {post.likeCount} Likes
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">
                                {post.childCount} Replies
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </span>
    )
}

export default PostItem
