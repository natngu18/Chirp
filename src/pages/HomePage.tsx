import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/context/AuthContext'
import PostForm from '@/features/post/components/PostForm'
import { doSignOut } from '@/firebase/auth'

export const HomePage = () => {
    const { firebaseUser: user } = useAuth()
    console.log('user: ', user)
    return (
        <div className=" pt-4 flex flex-col gap-3">
            {/* TODO: complete homepage, and postform */}
            <PostForm />
            <Separator />
            <button onClick={() => doSignOut()}>Sign out</button>
        </div>
    )
}
