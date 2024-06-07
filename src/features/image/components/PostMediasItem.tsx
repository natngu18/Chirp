import { usePostDetailsModal } from '@/components/context/PostModalContext'
import { Media } from '@/types'
import { motion } from 'framer-motion'
import { ImagesIcon } from 'lucide-react'

type Props = {
    postId: string
    images: Media[]
}

const variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

function PostMediasItem({ images, postId }: Props) {
    const { isOpen, toggle, setPostModalProps } = usePostDetailsModal()
    const handleImageClick = (index: number) => {
        setPostModalProps({ postId, images, selectedImageIndex: index })
        // Open the modal if it's not already open
        // Otherwise, it will replace the modal contents with new props
        if (!isOpen) {
            toggle()
        }
    }

    return (
        <motion.button
            variants={variants}
            initial="hidden"
            animate="show"
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
        </motion.button>
    )
}

export default PostMediasItem
