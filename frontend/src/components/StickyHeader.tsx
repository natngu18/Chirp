import React from 'react'
import CircularButton from './CircularButton'
import { ArrowLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    title?: string
    children?: React.ReactNode
    className?: string
    backButtonAction?: () => void
}

function StickyHeader({ title, children, className, backButtonAction }: Props) {
    return (
        <header
            className={cn(
                `sticky top-0 backdrop-blur-xl z-50 bg-white/50 flex gap-3 justify-between items-center p-4 transition-opacity duration-200`,
                className
            )}
        >
            <div className="flex gap-3 items-center">
                <CircularButton
                    onClick={() => backButtonAction?.()}
                    aria-label="Back button"
                >
                    <ArrowLeftIcon size={20} />
                </CircularButton>
                {title && <h1 className="text-xl">{title}</h1>}
            </div>

            {children}
        </header>
    )
}

export default StickyHeader
