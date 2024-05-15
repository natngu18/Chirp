import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import MediaPreview from './MediaPreview'

type Props = {
    medias: File[]
    onMediaDelete: (index: number) => void
}
function MediaCarousel({ medias, onMediaDelete }: Props) {
    return (
        <div className="relative w-full px-12">
            <Carousel opts={{ align: 'start' }}>
                <CarouselContent>
                    {medias.map((media, index) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                            <MediaPreview
                                file={media}
                                onDelete={() => onMediaDelete(index)}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default MediaCarousel
