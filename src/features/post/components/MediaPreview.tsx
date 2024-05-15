import CircularButton from '@/components/CircularButton'
import { Card } from '@/components/ui/card'
import { XIcon } from 'lucide-react'

type Props = {
    file: File
    onDelete: () => void
}
function MediaPreview({ file, onDelete }: Props) {
    return (
        <Card className="relative w-full h-full overflow-hidden aspect-square min-h-72">
            <img
                src={URL.createObjectURL(file)}
                className="w-full object-cover h-full rounded-md"
            />
            <div className="absolute top-1 right-1 flex gap-1">
                <CircularButton onClick={onDelete}>
                    <XIcon size={20} />
                </CircularButton>
            </div>
        </Card>
    )
}

export default MediaPreview
