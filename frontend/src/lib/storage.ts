import { UserResponse } from '@/features/auth/types'

const storagePrefix = 'nnguy3_'

const localStorage = {
    setUser: (user: UserResponse) => {
        window.localStorage.setItem(
            `${storagePrefix}user`,
            JSON.stringify(user)
        )
    },
    getUser: (): UserResponse | null => {
        return JSON.parse(
            window.localStorage.getItem(`${storagePrefix}user`) as string
        )
    },
    clearUser: () => {
        window.localStorage.removeItem(`${storagePrefix}user`)
    },
}

export default localStorage
