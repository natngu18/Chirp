import { cn } from '@/lib/utils'
import React, { ButtonHTMLAttributes } from 'react'
import { Button } from './ui/button'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
}

function CircularButton({ children, className, ...props }: Props) {
    return (
        <Button
            variant={'ghost'}
            className={cn(
                'relative h-fit rounded-full p-1 hover:bg-gray-50/75  transition-colors duration-400 ease-in-out',
                className
            )}
            {...props}
        >
            {children}
        </Button>
    )
}

export default CircularButton
