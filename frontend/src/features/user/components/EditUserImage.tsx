import CircularButton from '@/components/CircularButton'
import { cn } from '@/lib/utils'
import { CameraIcon, XIcon } from 'lucide-react'

type Props = {
    imageUrl?: string
    onDelete?: () => void
    onEdit?: () => void
    className?: string
    roundedImage?: boolean
}

function EditUserImage({
    imageUrl,
    onDelete,
    onEdit,
    className,
    roundedImage = false,
}: Props) {
    return (
        <div className={cn('relative w-full h-full', className)}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    className={`w-full object-cover h-full ${
                        roundedImage ? ' rounded-full' : ' rounded-none'
                    }`}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-300"></div>
            )}

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
                {onDelete && (
                    <div className="flex gap-1">
                        <CircularButton onClick={onDelete}>
                            <XIcon size={24} />
                        </CircularButton>
                    </div>
                )}

                {onEdit && (
                    <div className="flex gap-1">
                        <CircularButton onClick={onEdit}>
                            <CameraIcon size={24} />
                        </CircularButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EditUserImage
