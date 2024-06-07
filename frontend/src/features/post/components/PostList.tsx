import { PostBriefResponse } from '../types'
import PostItem from './PostItem'
type Props = {
    posts: PostBriefResponse[]
}

function PostList({ posts }: Props) {
    return (
        <>
            {posts.map((post) => (
                <div key={post.id}>
                    <PostItem post={post} separator={true} />
                </div>
            ))}
        </>
    )
}

export default PostList
