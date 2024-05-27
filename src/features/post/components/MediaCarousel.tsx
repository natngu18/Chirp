import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import MediaPreview from './MediaPreview'
import React from 'react'

type Props = {
    medias: File[]
    onMediaDelete: (index: number) => void
}
function MediaCarousel({ medias, onMediaDelete }: Props) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    // Update scroll button statuses when media changes
    React.useEffect(() => {
        if (!api) {
            return
        }
        setCanScrollNext(api.canScrollNext())
        setCanScrollPrev(api.canScrollPrev())
    }, [api, medias])

    // Update scroll button statuses when carousel scrolls
    React.useEffect(() => {
        if (!api) {
            return
        }

        api.on('scroll', () => {
            setCanScrollNext(api.canScrollNext())
            setCanScrollPrev(api.canScrollPrev())
        })
    }, [api])
    return (
        <div className="relative w-full px-12">
            <Carousel opts={{ align: 'start' }} setApi={setApi}>
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
                {canScrollPrev && <CarouselPrevious />}
                {canScrollNext && <CarouselNext />}
            </Carousel>
        </div>
    )
}

export default MediaCarousel
