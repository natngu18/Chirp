import React from 'react'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useFollow } from '../api/createAndDeleteFollow'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isShown?: boolean
    username: string
    isFollowing: boolean
}

const FollowButton = React.forwardRef<HTMLButtonElement, Props>(
    (
        { isShown = true, isFollowing, username, className, onClick, ...props },
        ref
    ) => {
        const { mutate, isPending } = useFollow(username)

        const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (isFollowing) {
                // unfollow
                mutate('unfollow')
            } else if (!isFollowing) {
                // follow

                mutate('follow')
            }

            // Call the original onClick if it was provided
            if (onClick) {
                onClick(e)
            }
        }
        return (
            <ButtonWithLoading
                className={cn(
                    `rounded-full ${
                        isShown
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                    }`,
                    className
                )}
                onClick={(e) => handleButtonClick(e)}
                isLoading={isPending}
                {...props}
                ref={ref}
            >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </ButtonWithLoading>
        )
    }
)

export default FollowButton
