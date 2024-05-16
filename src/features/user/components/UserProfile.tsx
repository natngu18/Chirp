import React from 'react'
import { useParams } from 'react-router'

export const UserProfile = () => {
    const { username } = useParams<{ username: string }>()
    return <div>UserProfile for {username}</div>
}
