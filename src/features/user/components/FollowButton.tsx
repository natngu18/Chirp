import React from 'react'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { ButtonHTMLAttributes } from 'react'
import { useCreateFollow } from '../api/createFollow'
import { useAuth } from '@/features/auth/context/AuthContext'
import { cn } from '@/lib/utils'
import { useDeleteFollow } from '../api/deleteFollow'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isShown: boolean
    userId: string
    username: string
    isFollowing: boolean
}

const FollowButton = React.forwardRef<HTMLButtonElement, Props>(
    ({ isShown, userId, isFollowing, username, className, ...props }, ref) => {
        const { firebaseUser } = useAuth()
        const { mutate: follow, isPending: isFollowPending } =
            useCreateFollow(username)
        const { mutate: unfollow, isPending: isUnfollowPending } =
            useDeleteFollow(username)

        // hide follow button if it's the current user
        if (firebaseUser?.uid === userId) {
            return null
        }

        const handleButtonClick = () => {
            // if the user is already following, then unfollow
            // etc...
            if (isFollowing) {
                // unfollow
                console.log('unfollow')
                unfollow()
            } else if (!isFollowing) {
                // follow

                follow()
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
                onClick={() => handleButtonClick()}
                isLoading={isFollowPending || isUnfollowPending}
                {...props}
                ref={ref}
            >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </ButtonWithLoading>
        )
    }
)

export default FollowButton
