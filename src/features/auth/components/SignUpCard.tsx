import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import SignUpForm from './SignUpForm'
import { Link } from 'react-router-dom'

function SignUpCard() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-2xl">Create a New Account</CardTitle>
                <CardDescription>
                    Enter your details below to sign up
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm />
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-center text-sm hover:underline font-bold"
                    >
                        Continue
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default SignUpCard
