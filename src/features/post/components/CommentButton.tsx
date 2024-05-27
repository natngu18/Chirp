import { Link } from 'react-router-dom'
import { CiChat1 } from 'react-icons/ci'

interface Props {
    postId: string
    commentCount: number
}

function CommentButton({ postId, commentCount }: Props) {
    return (
        <Link className="flex group items-center" to={`/posts/${postId}`}>
            <span className="group-hover:text-blue-600 rounded-full p-2 group-hover:bg-blue-600/10 transition-colors duration-200">
                <CiChat1 />
            </span>
            <span className="group-hover:text-blue-600">{commentCount}</span>
        </Link>
    )
}

export default CommentButton
