import { usePostDetailsModal } from '@/components/context/PostModalContext'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import useMediaQuery from '@/hooks/useMediaQuery'
import PostImageModalCarousel from '../../image/components/PostImageModalCarousel'
import PostDetails from '@/features/post/components/PostDetails'
import { X } from 'lucide-react'

function PostDetailsModal() {
    const { isOpen, toggle, postModalProps } = usePostDetailsModal()
    const isMobileScreen = useMediaQuery('(max-width: 640px)')
    return (
        <Dialog modal={true} open={isOpen} onOpenChange={() => toggle()}>
            <DialogContent
                className="flex min-h-full gap-0 border-0
    data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-0 data-[state=open]:zoom-in-0 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-[0%] data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-[0%]
    pointer-events-auto hover:cursor-auto max-h-screen left-0 bg-transparent p-0 rounded-none sm:rounded-none min-w-full top-0  translate-x-0 translate-y-0"
            >
                {/* ensures postmodalProps is defined (it should be anyways when isOpen is true) */}
                {isOpen && postModalProps && (
                    <div
                        className={`w-full items-center justify-center flex relative ${
                            !isMobileScreen ? 'w-full' : ''
                        }`}
                        // Close modal when empty space around image is clicked.
                        onClick={() => toggle()}
                    >
                        <PostImageModalCarousel
                            medias={postModalProps!.images}
                            initialIndex={postModalProps!.selectedImageIndex}
                        />
                        <DialogClose
                            className="top-2 absolute rounded-full  left-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground
    inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
    "
                        >
                            <X height={28} width={28} />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    </div>
                )}
                {!isMobileScreen && isOpen && postModalProps && (
                    <div className="border-l overflow-y-auto overflow-x-hidden bg-background w-1/2 ">
                        <PostDetails
                            postId={postModalProps!.postId}
                            // Don't need to display images for the post, since they are already displayed above.
                            displayImagesForSpecificPost={false}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default PostDetailsModal
