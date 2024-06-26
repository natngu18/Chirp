import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'
import { auth } from '@/firebase/firebase'
import storage from '@/lib/storage'
import { useGetUserById } from '../api/getUserById'
import { UserResponse } from '../types'
import { Spinner } from '@/components/Spinner'

type Props = {
    children?: ReactNode
}

type IAuthContext = {
    firebaseUser: FirebaseUser | null
    appUser: UserResponse | null
    loading: boolean
    token: string
}

const initialValue = {
    firebaseUser: null,
    appUser: null,
    loading: true,
    token: '',
}

const AuthContext = createContext<IAuthContext>(initialValue)
export const AuthProvider = ({ children }: Props) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
    // User data from backend
    const [appUser, setAppUser] = useState<UserResponse | null>(() =>
        storage.getUser()
    )
    // Fetch user data from backend, which contains additoinal information for Firebase user
    const userQuery = useGetUserById(
        firebaseUser?.uid || '',
        storage.getUser() ? false : true // Disable query if user data is already in localStorage
    )
    const [token, setToken] = useState<string>('')

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false)
            if (currentUser) {
                setFirebaseUser(currentUser)
                currentUser.getIdToken().then((idToken) => {
                    setToken(idToken)
                })
            } else {
                setFirebaseUser(null)
                setToken('')
            }
        })
        return unsubscribe
    }, [])
    useEffect(() => {
        if (firebaseUser) {
            firebaseUser.getIdToken().then((idToken) => {
                setToken(idToken)
            })
        }
    }, [firebaseUser])
    // Store user data from backend in localStorage
    useEffect(() => {
        if (userQuery.data) {
            setAppUser(userQuery.data)
            storage.setUser(userQuery.data)
        }
    }, [userQuery.data])

    return (
        <AuthContext.Provider
            value={{
                firebaseUser: firebaseUser,
                loading: loading || userQuery.isLoading,
                token,
                appUser,
            }}
        >
            {loading ||
                (userQuery.isLoading && (
                    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <Spinner size="lg" />
                    </div>
                ))}
            {/* {children} */}
            {!loading && !userQuery.isLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside the AuthProvider')
    }

    return context
}
