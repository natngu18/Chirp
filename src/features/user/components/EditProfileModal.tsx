import CircularButton from '@/components/CircularButton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'
import EditProfileForm from './EditProfileForm'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { useGetUserByUsername } from '../api/getUserByUsername'
import { useParams } from 'react-router-dom'
import { useUpdateUser } from '../api/updateUser'
import { Spinner } from '@/components/Spinner'
import { motion } from 'framer-motion'
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
                        <div
                            className={`sticky top-0 backdrop-blur-xl z-50 bg-white/50 flex gap-3 justify-between items-center p-2 transition-opacity duration-200`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex gap-3">
                                    <CircularButton
                                        onClick={() => setOpen(false)}
                                    >
                                        <ArrowLeftIcon size={20} />
                                    </CircularButton>
                                    <h1 className="text-xl">Edit profile</h1>
                                </div>

                                <ButtonWithLoading
                                    onClick={() =>
                                        submitFormRef.current?.click()
                                    }
                                    className="rounded-full w-28"
                                    isLoading={isPending}
                                >
                                    Save
                                </ButtonWithLoading>
                            </div>
                        </div>
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
                        <div className="min-h-screen">we</div>
                    </motion.div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileModal
