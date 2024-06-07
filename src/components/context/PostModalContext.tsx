import { Media } from '@/types'
import React, { useState, useContext, createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type PostModalProps = {
    postId: string
    images: Media[]
    selectedImageIndex: number
}
interface PostModalContextType {
    isOpen: boolean
    toggle: () => void
    //  Properties needed to  display the post modal
    postModalProps: PostModalProps | null
    setPostModalProps: React.Dispatch<
        React.SetStateAction<PostModalProps | null>
    >
}

const PostModalStateContext = createContext<PostModalContextType | undefined>(
    undefined
)

type Props = {
    children: React.ReactNode
}
export const PostDetailsModalProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [postModalProps, setPostModalProps] = useState<PostModalProps | null>(
        null
    )
    const toggle = () => setIsOpen(!isOpen)
    const location = useLocation()
    // Listen for changes in the URL to close the modal when navigating
    useEffect(() => {
        setIsOpen(false)
    }, [location])

    return (
        <PostModalStateContext.Provider
            value={{ isOpen, toggle, postModalProps, setPostModalProps }}
        >
            {children}
        </PostModalStateContext.Provider>
    )
}

export const usePostDetailsModal = () => {
    const context = useContext(PostModalStateContext)

    if (!context) {
        throw new Error(
            'usePostModal must be used inside the PostModalProvider'
        )
    }

    return context
}
