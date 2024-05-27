import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostAndParentPostsInfinite } from '../api/getPostAndParentPosts'
import { Spinner } from '@/components/Spinner'
import { useInView } from 'react-intersection-observer'
import PostItem from './PostItem'
import PostReplies from './PostReplies'
import PostForm from './PostForm'
import { Separator } from '@/components/ui/separator'

function PostDetails() {
    const { postId } = useParams()
    // Loads relevant post w/ matching postId as placeholder data, if it exists in the cache.
    const query = useGetPostAndParentPostsInfinite({ postId: postId! })
    // Fetch next page when user scrolls to top of the page.
    const { ref: topRef, inView } = useInView()
    useEffect(() => {
        if (inView && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage()
        }
    }, [inView, query])

    const postRef = useRef<HTMLDivElement>(null)

    // Scroll to relevant post only once, and when data is available.
    const [hasScrolled, setHasScrolled] = useState(false)

    // Allows for ability to re-scroll to relevant post when postId changes.
    useEffect(() => {
        setHasScrolled(false)
    }, [postId])

    useEffect(() => {
        // Do not do one-time scroll to relevant post if data is placeholder data.
        if (!query.isPlaceholderData && query.data && !hasScrolled) {
            console.log('scropll on query.data', query.data)

            postRef.current?.scrollIntoView()
            setHasScrolled(true)
        }
    }, [query, hasScrolled])
    if (query.isLoading || !query.data) {
        return (
            <div className="flex items-center w-full justify-center">
                <Spinner />
            </div>
        )
    }

    // could pass post source from navigation state (not params)
    // and initialize useQuery initialdata w/ specific post from there if it exists...

    // TODO: implement twitter details that loads parents w/ newly created endpoint.
    return (
        <div className="min-h-screen flex flex-col">
            {/* Do not want to fetch data when using placeholder data,
            which has fake pagination params */}
            {!query.isPlaceholderData && (
                <div
                    ref={topRef}
                    className="min-h-[1px] flex items-center justify-center bg-transparent"
                >
                    {query.isFetchingNextPage && <Spinner />}
                </div>
            )}

            {/* Reverse, so new pages appear on top */}
            {/* TODO: Rendering of new pages buggy */}
            {query.data?.pages
                .slice()
                .reverse()
                .map((page) =>
                    /* Last post is the post w/ id of "postId" */
                    page.items?.map((post, index) => {
                        // Initial data of query could be undefined if post is not found in cache.
                        if (!post) return null
                        // TODO: lots of logic for postid == postId, should just conditoinally render components based on that instead of checking everywhere..
                        // also, complete post replies.
                        //  attach postRef to relevant post
                        const itemProps =
                            post.id == Number(postId) ? { ref: postRef } : {}
                        return (
                            // Provide spacing for current post so it appears perfectly at top of the viewport when scrolled to.
                            <div
                                key={post.id}
                                className={
                                    post.id == Number(postId)
                                        ? `flex flex-col min-h-screen`
                                        : ``
                                }
                            >
                                {/* TODO: test out linking... then do replies. */}
                                <PostItem
                                    {...itemProps}
                                    post={post}
                                    linkDirection={
                                        // Render link direction if there is a post chain (multiple posts)
                                        page.items.length > 1
                                            ? index == 0
                                                ? `down`
                                                : index == page.items.length - 1
                                                ? `up`
                                                : `full`
                                            : undefined
                                    }
                                />

                                {/* Replies should go here, and only rendered when post.id == postId (aka last) */}
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
