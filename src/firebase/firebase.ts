import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
    apiKey: 'AIzaSyB_uBvRrjyM1SEayMVRBgDGptbGb-KwQrI',
    authDomain: 'chirps-a4ee9.firebaseapp.com',
    projectId: 'chirps-a4ee9',
    storageBucket: 'chirps-a4ee9.appspot.com',
    messagingSenderId: '184405755473',
    appId: '1:184405755473:web:86405b4f0cef92573c5a70',
    measurementId: 'G-GFFLT37CXC',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
// const analytics = getAnalytics(app)

export { app, auth }
