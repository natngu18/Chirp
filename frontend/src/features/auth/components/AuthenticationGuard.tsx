import { Navigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { useAuth } from '../context/AuthContext'

export const AuthenticationGuard = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { firebaseUser, appUser } = useAuth()
    // Check if the user is authenticated
    if (!firebaseUser) {
        // this avoids updating Toaster component while AuthenticationGuard is rendering.
        setTimeout(() =>
            toast({
                variant: 'destructive',
                title: 'Please Sign In',
                description: 'You must be logged in to access this page.',
            })
        )
        return <Navigate to="/login" replace />
    }

    return children
}
