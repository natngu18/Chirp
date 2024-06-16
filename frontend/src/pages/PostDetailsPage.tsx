import PostDetails from '@/features/post/components/PostDetails'
import { useParams } from 'react-router-dom'

export const PostDetailsPage = () => {
    const { postId } = useParams()

    return (
        <div>
            <PostDetails postId={postId!} />
        </div>
    )
}
