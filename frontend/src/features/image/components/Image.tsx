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
    rounded?: boolean
    className?: string
    disableAnimation?: boolean
} & React.ImgHTMLAttributes<HTMLImageElement>

function Image({
    rounded = false,
    className,
    disableAnimation = false,
    ...imgProps
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
                className={`h-full w-full object-cover ${
                    rounded ? 'rounded-full' : ''
                }`}
                {...imgProps}
            />
        </motion.div>
    )
}

export default Image
