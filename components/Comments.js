import timeago from "lib/timeago"
import { useState } from 'react'
import NewComment from "components/NewComment"

const Comment = ({ comment, post }) => {
    const [showReply, setShowReply] = useState(false)
    return (
        <div className="comment">
            <p className="font-bold">
                {comment.author.name}{" "}
                <span className="font-thin ">
                    {timeago.format(new Date(comment.createdAt))}
                </span>
            </p>
            <p>{comment.content}</p>
            {showReply ? (
                <NewComment comment={comment} post={post} />
            ) : (
            <p className='hover:underline text-sm main-contrast bg-gradient-to-r from-transparent to-orange-50 rounded-full px-4 cursor-pointer text-right font-bold'
            onClick={() => setShowReply(true)}>
            reply
            </p>)}
        </div>
    )
}

export default function Comments({ comments, post }) {
    if (!comments)
        return (
            <>
                <p className="main-color font-bold ml-10 -mb-5">
                    Be the first to comment on this post:
                </p>
            </>
        )

    return (
        <>
            <div>
                {comments.map((comment, index) => (
                    <>
                    <Comment key={index} comment={comment} post={post} />
                    {comment.comments && (
                        <div className="ml-4">
                        <Comments comments={comment.comments} post={post}/></div>
                    )}
                    </>
                ))}
            </div>
        </>
    )
}
