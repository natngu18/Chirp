export type BaseEntity<TId> = {
    id: TId
    createdAt: string
    updatedAt: string
}

export interface Media extends BaseEntity<number> {
    url: string
    type: MediaType
}

export type MediaType = 'image' | 'video'

export type PaginatedList<T> = {
    items: T[]
    totalPages: number
    pageNumber: number
    totalCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export type PaginationParams = {
    pageNumber?: number
    pageSize?: number
}
