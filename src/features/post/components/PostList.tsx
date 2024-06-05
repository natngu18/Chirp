import { PostBriefResponse } from '../types'
import PostItem from './PostItem'
import { motion } from 'framer-motion'
type Props = {
    posts: PostBriefResponse[]
}

function PostList({ posts }: Props) {
    const variants = {
        hidden: { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
            },
        },
    }
    return (
        <>
            {posts.map((post) => (
                <motion.div
                    key={post.id}
                    variants={variants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                >
                    <PostItem post={post} separator={true} />
                </motion.div>
            ))}
        </>
    )
}

export default PostList
