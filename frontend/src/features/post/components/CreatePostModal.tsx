import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import React from 'react'
import PostForm from './PostForm'
import StickyHeader from '@/components/StickyHeader'
type Props = {
    children: React.ReactNode
}
const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}
function CreatePostModalTrigger({ children }: Props) {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-screen top-[5%] translate-y-[-5%] min-w-full  sm:min-w-[550px] sm:min-h-fit  p-0 overflow-hidden">
                <ScrollArea className="relative overflow-hidden overflow-y-auto h-screen  sm:h-[450px]   pr-2 ">
                    <motion.div
                        variants={variants}
                        initial="hidden"
                        animate="show"
                    >
                        <StickyHeader
                            title="Create post"
                            backButtonAction={() => setOpen(false)}
                        />

                        <PostForm onPostSuccess={() => setOpen(false)} />
                    </motion.div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePostModalTrigger
