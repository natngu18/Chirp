import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading: boolean
    children?: React.ReactNode
}
const ButtonWithLoading = React.forwardRef<HTMLButtonElement, Props>(
    ({ isLoading, disabled, children, className, ...props }, ref) => {
        const [showLoading, setShowLoading] = useState(false)
        // Minimum delay to show loading spinner
        useEffect(() => {
            let timeoutId: NodeJS.Timeout
            if (isLoading && !showLoading) {
                timeoutId = setTimeout(() => setShowLoading(true), 200) // 200ms delay
            } else if (!isLoading && showLoading) {
                setShowLoading(false)
            }

            return () => {
                clearTimeout(timeoutId)
            }
        }, [isLoading, showLoading])
        return (
            <Button
                ref={ref}
                className={cn('flex w-20', className)}
                disabled={showLoading ? true : disabled}
                {...props}
            >
                {showLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading
                    </>
                ) : (
                    <>{children}</>
                )}
            </Button>
        )
    }
)

export default ButtonWithLoading
