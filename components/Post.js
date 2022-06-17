import Link from "next/link"
import timeago from "lib/timeago"
import Image from "next/image"

export default function Post({ post }) {
    return (
        <div className="contentbox">
            <div className="flex items-center main-contrast">
                <Link href={`/r/${post.subredditName}`}>
                    <span className="cursor-pointer hover:underline pr-2 font-bold">
                        /r/{post.subredditName}{" "}
                    </span>
                </Link>
                <Link href={`/u/${post.author.name}`}>
                    <span className="hover:underline">
                        Posted by {post.author.name}{" "}
                    </span>
                </Link>

                <Link
                    href={`/r/${post.subredditName}/comments/${post.id}`}
                    className="cursor-pointer hover:underline "
                >
                    <span className="ml-2">
                        {timeago.format(new Date(post.createdAt))}
                    </span>
                </Link>
            </div>

            <div>
                <Link
                    href={`/r/${post.subredditName}/comments/${post.id}`}
                    className="cursor-pointer hover:underline "
                >
                    <p className="flex-shrink text-2xl font-bold mt-2 ">
                        {post.title}
                    </p>
                </Link>
                {post.image && (
                    <img
                        className="flex-shrink text-base w-auto"
                        src={post.image}
                        alt="user uploaded image"
                    />
                )}
                <p className="flex-shrink text-base font-normal width-auto mt-2">
                    {post.content}
                </p>
            </div>
        </div>
    )
}
