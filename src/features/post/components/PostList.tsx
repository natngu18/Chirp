// Should be reusable
// This should not do the fetching...
// it can render following posts, search results, user posts, etc.
import React from 'react'
import { PostBriefResponse, PostInfo } from '../types'
import PostItem from './PostItem'
import { Separator } from '@/components/ui/separator'

type Props = {
    posts: PostBriefResponse[]

    // Posts can be obtained from different sources.
    // This is used to update cache key for optimistic updates, depending on source
    postInfo: PostInfo
}

function PostList({ posts, postInfo }: Props) {
    return (
        <>
            {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                    <PostItem post={post} postInfo={postInfo} />
                    {index < posts.length - 1 && <Separator />}
                </React.Fragment>
            ))}
        </>
    )
}

export default PostList
