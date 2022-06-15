import timeago from "lib/timeago"

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <p className="font-bold">
                {comment.author.name}{" "}
                <span className="font-thin ">
                    {timeago.format(new Date(comment.createdAt))}
                </span>
            </p>
            <p>{comment.content}</p>
        </div>
    )
}

export default function Comments({ comments }) {
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
                    <Comment key={index} comment={comment} />
                ))}
            </div>
        </>
    )
}
