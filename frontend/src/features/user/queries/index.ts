export const userQueryKeys = {
    all: ['users'] as const,
    lists: () => [...userQueryKeys.all, 'list'] as const,
    detail: (username: string) =>
        [...userQueryKeys.all, 'detail', username] as const,
    topUsers: () => [...userQueryKeys.lists(), 'top'] as const,
}
