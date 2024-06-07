import { Loader2 } from 'lucide-react'

function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin" size={40} />
        </div>
    )
}

export default LoadingPage
