import { Media } from '@/types'

import ImageModal from './ImageModal'
type Props = {
    images: Media[]
    postId: string
}

function PostImageGallery({ images, postId }: Props) {
    console.log('postid', postId)
    return (
        // prevent parent button from triggering when interacting with modal(s)
        <div onClick={(e) => e.stopPropagation()}>
            {images.length === 1 && (
                <ImageModal
                    images={images}
                    postId={postId}
                    selectedImageIndex={0}
                >
                    <div className=" overflow-hidden min-h-36 aspect-[4/5] ">
                        <img
                            src={images[0].url}
                            alt="post"
                            className="w-full object-cover h-full  rounded-md"
                        />
                    </div>
                </ImageModal>
            )}
            {images.length === 2 && (
                <div className="flex gap-1">
                    {images.map((image, index) => (
                        <div className="w-1/2 overflow-hidden min-h-36 aspect-[4/5]">
                            <ImageModal
                                images={images}
                                postId={postId}
                                key={index}
                                selectedImageIndex={index}
                            >
                                <img
                                    key={index}
                                    src={image.url}
                                    alt="post"
                                    className={`w-full object-cover h-full ${
                                        index === 0
                                            ? 'rounded-tl-md rounded-bl-md'
                                            : 'rounded-tr-md rounded-br-md'
                                    }`}
                                />
                            </ImageModal>
                        </div>
                    ))}
                </div>
            )}
            {images.length === 3 && (
                <div className="flex gap-1">
                    {/* Left image */}
                    <div className="w-1/2 overflow-hidden min-h-36 aspect-[6/4] ">
                        <ImageModal
                            images={images}
                            postId={postId}
                            selectedImageIndex={0}
                        >
                            <img
                                src={images[0].url}
                                className="w-full object-cover h-full  rounded-l-md"
                            />
                        </ImageModal>
                    </div>
                    {/* Right images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(1).map((image, index) => (
                            <ImageModal
                                images={images}
                                postId={postId}
                                key={index}
                                selectedImageIndex={index + 1} // Add the start index of the slice
                            >
                                <div
                                    key={index}
                                    className="overflow-hidden min-h-36 aspect-[6/4]"
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
                                </div>
                            </ImageModal>
                        ))}
                    </div>
                </div>
            )}
            {images.length === 4 && (
                <div className="flex gap-1">
                    {/* Left images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(0, 2).map((image, index) => (
                            <ImageModal
                                images={images}
                                postId={postId}
                                key={index}
                                selectedImageIndex={index}
                            >
                                <div
                                    key={index}
                                    className="overflow-hidden min-h-36 aspect-[6/4]"
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
                                </div>
                            </ImageModal>
                        ))}
                    </div>
                    {/* Right images */}
                    <div className="flex w-1/2 flex-col gap-1">
                        {images.slice(2).map((image, index) => (
                            <ImageModal
                                images={images}
                                postId={postId}
                                key={index}
                                selectedImageIndex={index + 2} // Add the start index of the slice
                            >
                                <div className="overflow-hidden min-h-36 aspect-[6/4]">
                                    <img
                                        src={image.url}
                                        className={
                                            'w-full object-cover h-full' +
                                            (index === 0
                                                ? ' rounded-tr-md'
                                                : ' rounded-br-md')
                                        }
                                    />
                                </div>
                            </ImageModal>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostImageGallery
