import { UserBriefResponse } from '../types'

type Props = {
    user: UserBriefResponse
}

function UserSearchSuggestionItem({ user }: Props) {
    return (
        <div className="flex gap-3 items-center">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                    src={user.avatar.url}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="aspect-square h-full w-full"
                />
            </span>

            <div>
                <div className="font-semibold">{user.displayName}</div>
                <div className="text-gray-500">@{user.username}</div>
            </div>
        </div>
    )
}

export default UserSearchSuggestionItem
