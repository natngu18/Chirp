import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}
type Props = {
    src: string
    alt?: string
    rounded?: boolean
    className?: string
    disableAnimation?: boolean
}

function Image({
    src,
    alt,
    rounded = false,
    className,
    disableAnimation = false,
}: Props) {
    return (
        <motion.div
            variants={disableAnimation ? {} : variants}
            initial={disableAnimation ? {} : 'hidden'}
            animate={disableAnimation ? {} : 'show'}
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
        </motion.div>
    )
}

export default Image
