import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Media } from '@/types'
import React from 'react'
import AutoHeight from 'embla-carousel-auto-height'

type Props = {
    medias: Media[]
    initialIndex?: number
}
function PostImageModalCarousel({ medias, initialIndex = 0 }: Props) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    // Scroll to initial index when carousel is initialized
    React.useEffect(() => {
        if (api) {
            api.scrollTo(initialIndex, true)
        }
    }, [api, initialIndex])
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

    // Embla carousel AutoHeight calculates slide heights when initialized.
    // It will calculate a 0 height if the images are not loaded.
    // This ensures that the carousel is reinitialized with proper heights when images are loaded.
    // (Call this everytime an image loads, since keeping track of all images loaded seems to not work)
    const reinitCarousel = () => {
        if (api) {
            api.reInit()
        }
    }
    return (
        <div className="relative w-full " onClick={(e) => e.stopPropagation()}>
            <Carousel
                opts={{ align: 'start' }}
                setApi={setApi}
                plugins={[AutoHeight()]}
                className="w-full"
            >
                <CarouselContent className="items-center h-fit">
                    {medias.map((media, index) => (
                        <CarouselItem key={index}>
                            <img
                                src={media.url}
                                className="w-full h-full"
                                loading="eager"
                                referrerPolicy="no-referrer"
                                onLoad={() => {
                                    reinitCarousel()
                                }}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {canScrollPrev && (
                    <CarouselPrevious className="translate-x-0 left-0" />
                )}
                {canScrollNext && (
                    <CarouselNext className="translate-x-0 right-0" />
                )}
            </Carousel>
        </div>
    )
}

export default PostImageModalCarousel
