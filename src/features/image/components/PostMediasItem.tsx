import { usePostModal } from '@/components/context/PostModalContext'
import { Media } from '@/types'
import { ImagesIcon } from 'lucide-react'

type Props = {
    postId: string
    images: Media[]
}

function PostMediasItem({ images, postId }: Props) {
    const { isOpen, toggle, setPostModalProps } = usePostModal()
    const handleImageClick = (index: number) => {
        setPostModalProps({ postId, images, selectedImageIndex: index })
        // Open the modal if it's not already open
        // Otherwise, it will replace the modal contents with new props
        if (!isOpen) {
            toggle()
        }
    }

    return (
        <button
            className="relative overflow-hidden aspect-square"
            onClick={() => {
                handleImageClick(0)
            }}
        >
            <img
                src={images[0].url}
                alt="post"
                className="w-full object-cover h-full"
            />
            {images.length > 1 && (
                <ImagesIcon
                    height={24}
                    width={24}
                    className="absolute bottom-0 right-0 text-background-contrast p-1 bg-background rounded-tl-md"
                />
            )}
        </button>
    )
}

export default PostMediasItem
