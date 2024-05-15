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
import { useGetUser } from '../api/getUser'
import { UserResponse } from '../types'

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
    const userQuery = useGetUser(
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
            } else {
                setFirebaseUser(null)
                // storage.clearUser() // Clear user data in localStorage when Firebase user is null
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
            {loading || (userQuery.isLoading && <div>Loading...</div>)}
            {children}
            {/* {!loading && children} */}
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
