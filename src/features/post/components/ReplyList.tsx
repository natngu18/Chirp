import React from 'react'
import { PostInfo, ParentAndReplyResponse } from '../types'
import PostItem from './PostItem'
import { Separator } from '@/components/ui/separator'

type Props = {
    parentPostsAndReplies: ParentAndReplyResponse[]

    // Posts can be obtained from different sources.
    // This is used to update cache key for optimistic updates, depending on source
    postInfo: PostInfo
}

function ReplyList({ parentPostsAndReplies, postInfo }: Props) {
    return (
        <>
            {parentPostsAndReplies.map((item, index) => (
                // key can't be parent post id, possible to not be unique
                <React.Fragment key={item.userReply.id}>
                    <PostItem
                        post={item.parentPost}
                        postInfo={postInfo}
                        linkDirection="down"
                    />
                    <PostItem
                        post={item.userReply}
                        postInfo={postInfo}
                        linkDirection="up"
                    />
                    {index < parentPostsAndReplies.length - 1 && <Separator />}
                </React.Fragment>
            ))}
        </>
    )
}

export default ReplyList
