export const postQueryKeys = {
    all: ['posts'] as const,
    // This query key should be used for all queries that return a list of posts.
    // Data should be of type InfiniteData<PaginatedList<PostBriefResponse>>
    // This key can be used to match query key's fuzzily to affect/interact with all queries caches.
    lists: () => [...postQueryKeys.all, 'list'] as const,
    searchResults: (searchText: string) =>
        [...postQueryKeys.lists(), 'search', searchText] as const,
    userOriginalPosts: (username: string) =>
        [...postQueryKeys.lists(), 'originalPosts', username] as const,
    userReplies: (username: string) =>
        [...postQueryKeys.lists(), 'replies', username] as const,
    details: () => [...postQueryKeys.all, 'detail'] as const,
    // Query key for post detail, it is a list because it includes the post's parents.
    detail: (postId: string) =>
        [...postQueryKeys.lists(), 'detail', postId] as const,
    postReplies: (postId: string) =>
        [...postQueryKeys.lists(), 'replies', postId] as const,
    userPostMedias: (username: string) =>
        [...postQueryKeys.all, 'medias', username] as const,
    userLikedPosts: (username: string) =>
        [...postQueryKeys.lists(), 'liked', username] as const,
    followedUsersPosts: () => [...postQueryKeys.lists(), 'followed'] as const,
}
