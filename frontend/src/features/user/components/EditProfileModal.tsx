import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import EditProfileForm from './EditProfileForm'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { useGetUserByUsername } from '../api/getUserByUsername'
import { useParams } from 'react-router-dom'
import { useUpdateUser } from '../api/updateUser'
import { Spinner } from '@/components/Spinner'
import { motion } from 'framer-motion'
import StickyHeader from '@/components/StickyHeader'
type Props = { children: React.ReactNode }
const variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}
function EditProfileModal({ children }: Props) {
    const { username } = useParams<{ username: string }>()
    const query = useGetUserByUsername(username!)
    const { mutate, isPending } = useUpdateUser(username!)

    const [open, setOpen] = React.useState(false)

    // Submit  form in child component
    const submitFormRef = React.useRef<HTMLButtonElement>(null)
    if (query.isLoading || !query.data)
        return (
            <div className="min-h-full flex flex-col items-center justify-center">
                <Spinner />
            </div>
        )
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-screen min-w-full min-h-full sm:min-w-[550px] sm:min-h-fit p-0 overflow-hidden">
                <ScrollArea className="relative overflow-hidden overflow-y-auto h-screen sm:h-[650px] pr-2 ">
                    <motion.div
                        variants={variants}
                        initial="hidden"
                        animate="show"
                    >
                        <StickyHeader
                            title="Edit profile"
                            backButtonAction={() => setOpen(false)}
                        >
                            <ButtonWithLoading
                                onClick={() => submitFormRef.current?.click()}
                                className="rounded-full w-28"
                                isLoading={isPending}
                            >
                                Save
                            </ButtonWithLoading>
                        </StickyHeader>

                        <EditProfileForm
                            ref={submitFormRef}
                            onSubmit={mutate}
                            onSuccess={() => setOpen(false)}
                            defaultValues={{
                                bio: query.data?.bio ?? '',
                                avatarImage: query.data?.avatar.url,
                                backgroundImage:
                                    query.data?.backgroundImage?.url ??
                                    undefined,
                                displayName: query.data?.displayName,
                                location: query.data?.location ?? '',
                            }}
                        />
                    </motion.div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileModal
