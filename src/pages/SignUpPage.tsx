import SignUpCard from '@/features/auth/components/SignUpCard'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Navigate } from 'react-router'

function SignUpPage() {
    const { firebaseUser, appUser } = useAuth()
    return (
        <>
            {firebaseUser && appUser && (
                <Navigate to={'/home'} replace={true} />
            )}
            <div className="flex-1 flex h-full items-center justify-center">
                {/* <CreateAccountModal /> */}
                <SignUpCard />
            </div>
        </>
    )
}

export default SignUpPage
