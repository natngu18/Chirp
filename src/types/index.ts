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
