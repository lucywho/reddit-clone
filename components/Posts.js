import timeago from "lib/timeago"

const Post = ({ post }) => {
    return (
        <div className="contentbox">
            <div className="flex items-center text-gray-800">
                /r/{post.subredditName} Posted by {post.author.name}{" "}
                {timeago.format(new Date(post.createdAt))}
            </div>

            <div>
                <p className="flex-shrink text-2xl font-bold mt-2 ">
                    {post.title}
                </p>
                <p className="flex-shrink text-base font-normal width-auto mt-2">
                    {post.content}
                </p>
            </div>
        </div>
    )
}

export default function Posts({ posts }) {
    if (!posts) return null

    return (
        <>
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </>
    )
}
