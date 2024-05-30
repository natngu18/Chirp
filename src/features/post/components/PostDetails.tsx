import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostAndParentPostsInfinite } from '../api/getPostAndParentPosts'
import { Spinner } from '@/components/Spinner'
import { useInView } from 'react-intersection-observer'
import PostItem from './PostItem'
import PostReplies from './PostReplies'
import PostForm from './PostForm'
import { Separator } from '@/components/ui/separator'

type Props = {
    // Should be provided when not part of the route params.
    propPostId?: string
    // Specifically set to false when in image modal view
    displayImagesForSpecificPost?: boolean
}
function PostDetails({
    propPostId,
    displayImagesForSpecificPost = true,
}: Props) {
    const { postId: urlPostId } = useParams()
    // NOTE: propPostId should have precedence over urlPostId,
    // because we are capable of triggering image modal view for a post different
    // than the one in the url.
    const postId = propPostId ? propPostId : urlPostId

    // Loads relevant post w/ matching postId as placeholder data, if it exists in the cache.
    const query = useGetPostAndParentPostsInfinite({
        postId: postId!,
    })
    // Fetch next page when user scrolls to top of the page.
    const { ref: topRef, inView } = useInView()
    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage()
        }
    }, [inView, query])

    if (query.isLoading || !query.data) {
        return (
            <div className="flex items-center w-full justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Do not want to fetch data when using placeholder data,
            which has fake pagination params */}
            {!query.isPlaceholderData && query.hasNextPage && (
                <div
                    ref={topRef}
                    className="min-h-[1px] flex items-center justify-center bg-transparent"
                >
                    {query.isFetchingNextPage && <Spinner />}
                </div>
            )}

            {/* Reverse, so new pages appear on top */}
            {/* Parent pages appear on top */}
            {query.data?.pages
                .slice()
                .reverse()
                .map((page, pageIndex, allPages) =>
                    /* Last post is the post w/ id of "postId" */
                    page.items?.map((post, postIndex) => {
                        // Initial data of query could be undefined if post is not found in cache.
                        if (!post) return null

                        return (
                            // Provide spacing for relevant post so it appears perfectly at top of the viewport when scrolled to.
                            <div
                                key={post.id}
                                className={
                                    post.id == Number(postId)
                                        ? `flex flex-col min-h-screen`
                                        : ``
                                }
                            >
                                <PostItem
                                    post={post}
                                    disablePostLink={post.id == Number(postId)}
                                    linkDirection={
                                        // Render link direction if there is a post chain (multiple posts)
                                        page.items.length > 1 ||
                                        allPages.length > 1
                                            ? pageIndex === 0 && postIndex === 0
                                                ? `down`
                                                : pageIndex ===
                                                      allPages.length - 1 &&
                                                  postIndex ===
                                                      page.items.length - 1
                                                ? `up`
                                                : `full`
                                            : undefined
                                    }
                                    // Display images only relevant for the specified post
                                    displayImages={
                                        post.id == Number(postId)
                                            ? displayImagesForSpecificPost
                                            : true
                                    }
                                />

                                {/* Rendered only below the relevant post (when post.id == postId (aka last)) */}
                                {post.id == Number(postId) && (
                                    <>
                                        <PostForm
                                            placeholder="Post your reply"
                                            parentPostId={post.id.toString()}
                                        />
                                        <Separator />
                                        <PostReplies
                                            postId={postId!.toString()}
                                        />
                                    </>
                                )}
                            </div>
                        )
                    })
                )}
        </div>
    )
}

export default PostDetails
