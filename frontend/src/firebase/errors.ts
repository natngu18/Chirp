import { FirebaseError } from 'firebase/app'

// https://firebase.google.com/docs/auth/admin/errors

export const generateFirebaseAuthErrorMessage = (error: FirebaseError) => {
    switch (error?.code) {
        case 'auth/invalid-email':
            return 'Invalid email address. Please enter a valid email.'
        case 'auth/user-not-found':
            return 'User not found. Please check the email address.'
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.'
        case 'auth/email-already-in-use':
            return 'Email already in use. Please try another email.'
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.'
        case 'auth/invalid-verification-code':
            return 'Invalid verification code. Please try again.'
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please try again.'

        case 'auth/credential-already-in-use':
            return 'Credentials already in use. Please try again.'

        default:
            return 'An unknown error occurred. Please try again.'
    }
}
