import SignUpCard from '@/features/auth/components/SignUpCard'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Navigate } from 'react-router'

export const SignUpPage = () => {
    const { firebaseUser, appUser } = useAuth()
    return (
        <>
            {firebaseUser && appUser && <Navigate to={'/'} replace={true} />}
            <div className="flex-1 flex h-full items-center justify-center">
                {/* <CreateAccountModal /> */}
                <SignUpCard />
            </div>
        </>
    )
}
