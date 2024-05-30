import { cn } from '@/lib/utils'

type Props = {
    src: string
    alt?: string
    rounded?: boolean
    className?: string
}

function Image({ src, alt, rounded = false, className }: Props) {
    return (
        <div
            className={cn(
                `overflow-hidden ${rounded ? 'rounded-full' : ''}`,
                className
            )}
        >
            <img
                src={src}
                alt={alt}
                className={`h-full w-full object-cover ${
                    rounded ? 'rounded-full' : ''
                }`}
            />
        </div>
    )
}

export default Image
