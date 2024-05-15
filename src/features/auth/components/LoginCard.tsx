import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import LoginForm from './LoginForm'
import { Link } from 'react-router-dom'
import SignInWithGoogleButton from './SignInWithGoogleButton'

function LoginCard() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your details below to sign in
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <LoginForm />
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                        to="/register"
                        className="text-center text-sm hover:underline font-bold"
                    >
                        Sign Up
                    </Link>
                </div>

                <div className="flex flex-row text-center w-full">
                    <div className="border-b-2 mb-2.5 mr-2 w-full"></div>
                    <div className="text-sm font-bold w-fit">OR</div>
                    <div className="border-b-2 mb-2.5 ml-2 w-full"></div>
                </div>
                <SignInWithGoogleButton />
            </CardContent>
        </Card>
    )
}

export default LoginCard
