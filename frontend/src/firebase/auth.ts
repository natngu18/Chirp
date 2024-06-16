import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth'
import { auth } from './firebase'
import storage from '@/lib/storage'

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
}

export const doSignInWithEmailAndPassword = (
    email: string,
    password: string
) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const doSignOut = () => {
    // Clear user data from backend
    storage.clearUser()
    return auth.signOut()
}

export const doCreateUserWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    return createUserWithEmailAndPassword(auth, email, password)
}
