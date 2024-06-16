import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '../../auth/context/AuthContext'
import Image from '@/features/image/components/Image'
import { EllipsisIcon } from 'lucide-react'
import { doSignOut } from '@/firebase/auth'
import { useNavigate } from 'react-router'

type Props = {
    isSmallerThanXlScreen: boolean
}

function UserMenu({ isSmallerThanXlScreen }: Props) {
    const { appUser } = useAuth()
    const navigate = useNavigate()
    if (!appUser) return null
    return (
        <div className="w-full px-2">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    className={`${
                        isSmallerThanXlScreen ? `` : `hover:bg-slate-50`
                    }  rounded-full w-full`}
                >
                    <div
                        className={`flex gap-3 items-center ${
                            isSmallerThanXlScreen
                                ? 'justify-center'
                                : 'justify-between'
                        } rounded-full p-2 w-full`}
                    >
                        <div className="flex gap-3 items-center">
                            <Image
                                className="h-12 w-12 clickable-object"
                                src={appUser.avatar.url}
                                alt={appUser.username}
                                rounded={true}
                            />
                            {!isSmallerThanXlScreen && (
                                <div className="flex flex-col gap-1 items-start">
                                    <div className="text-sm font-semibold">
                                        {appUser.displayName}
                                    </div>
                                    <div className=" text-xs text-gray-500">
                                        @{appUser.username}
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isSmallerThanXlScreen && (
                            <EllipsisIcon className="h-4 w-4" />
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    className="shadow-xl rounded-lg"
                >
                    <DropdownMenuItem
                        onClick={async () => {
                            await doSignOut()
                            navigate('/login', { replace: true })
                        }}
                        className="hover:cursor-pointer"
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserMenu
