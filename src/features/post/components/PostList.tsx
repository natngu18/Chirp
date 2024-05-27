// Should be reusable
// This should not do the fetching...
// it can render following posts, search results, user posts, etc.
import React from 'react'
import { PostBriefResponse } from '../types'
import PostItem from './PostItem'

type Props = {
    posts: PostBriefResponse[]
}

function PostList({ posts }: Props) {
    return (
        <div>
            {posts.map((post) => (
                <React.Fragment key={post.id}>
                    <PostItem post={post} separator={true} />
                </React.Fragment>
            ))}
        </div>
    )
}

export default PostList
