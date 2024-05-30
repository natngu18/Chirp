import { Media } from '@/types'
import { usePostModal } from '@/components/context/PostModalContext'
type Props = {
    images: Media[]
    postId: string
}

function PostImageGallery({ images, postId }: Props) {
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
        // prevent parent button from triggering when interacting with image(s)
        <div onClick={(e) => e.stopPropagation()}>
            {images.length === 1 && (
                <button
                    className=" overflow-hidden  aspect-[4/5] hover:cursor-pointer"
                    onClick={() => {
                        handleImageClick(0)
                    }}
                >
                    <img
                        src={images[0].url}
                        alt="post"
                        className="w-full object-cover h-full  rounded-md"
                    />
                </button>
            )}
            {images.length === 2 && (
                <div className="flex gap-1">
                    {images.map((image, index) => (
                        <button
                            className="w-1/2 overflow-hidden  aspect-[4/5] hover:cursor-pointer"
                            onClick={() => handleImageClick(index)}
                            key={index}
                        >
                            <img
                                src={image.url}
                                alt="post"
                                className={`w-full object-cover h-full ${
                                    index === 0
                                        ? 'rounded-tl-md rounded-bl-md'
                                        : 'rounded-tr-md rounded-br-md'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
            {images.length === 3 && (
                <div className="flex gap-1">
                    {/* Left image */}
                    <button
                        className="w-1/2 overflow-hidden  aspect-[6/4] hover:cursor-pointer"
                        onClick={() => handleImageClick(0)}
                    >
                        <img
                            src={images[0].url}
                            className="w-full object-cover h-full  rounded-l-md"
                        />
                    </button>
                    {/* Right images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(1).map((image, index) => (
                            <button
                                key={index}
                                className="overflow-hidden  aspect-[6/4] hover:cursor-pointer"
                                onClick={() => handleImageClick(index + 1)} // Add the start index of the slice
                            >
                                <img
                                    src={image.url}
                                    className={
                                        'w-full object-cover h-full' +
                                        (index === 0
                                            ? ' rounded-tr-md'
                                            : ' rounded-br-md')
                                    }
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {images.length === 4 && (
                <div className="flex gap-1">
                    {/* Left images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(0, 2).map((image, index) => (
                            <button
                                key={index}
                                className="overflow-hidden  aspect-[6/4] hover:cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={image.url}
                                    className={
                                        'w-full object-cover h-full' +
                                        (index === 0
                                            ? ' rounded-tl-md'
                                            : ' rounded-bl-md')
                                    }
                                />
                            </button>
                        ))}
                    </div>
                    {/* Right images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(2).map((image, index) => (
                            <button
                                key={index}
                                className="overflow-hidden  aspect-[6/4] hover:cursor-pointer"
                                onClick={() => handleImageClick(index + 2)} // Add the start index of the slice
                            >
                                <img
                                    src={image.url}
                                    className={
                                        'w-full object-cover h-full' +
                                        (index === 0
                                            ? ' rounded-tr-md'
                                            : ' rounded-br-md')
                                    }
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostImageGallery
