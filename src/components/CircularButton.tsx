import { cn } from '@/lib/utils'
import React, { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
}

function CircularButton({ children, className, ...props }: Props) {
    return (
        <button
            className={cn(
                'relative  rounded-full p-1 hover:bg-gray-50/75  transition-colors duration-400 ease-in-out',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default CircularButton
