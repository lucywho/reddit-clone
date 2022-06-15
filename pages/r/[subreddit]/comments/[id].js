import Link from "next/link"
import { useSession } from "next-auth/react"
import timeago from "lib/timeago"
import prisma from "lib/prisma"
import { getPost, getSubreddit } from "lib/data.js"
import NewComment from "components/NewComment"
import Loading from "components/Loading"

export default function Post({ subreddit, post }) {
    const { data: session, status } = useSession()

    const loading = status === "loading"

    if (loading) {
        return <Loading />
    }

    if (!post) {
        return (
            <>
                <p className="p-10 main-contrast font-bold">
                    This post does not exist
                </p>
                <Link href={`/`}>
                    <button className="button ml-10 p-3">
                        back to the homepage
                    </button>
                </Link>
            </>
        )
    }

    return (
        <>
            <div className="flex flex-row mt-10">
                <Link href={`/`}>
                    <button className="button ml-10 p-3">
                        back to the homepage
                    </button>
                </Link>
                <Link href={`/r/${subreddit.name}`}>
                    <button className="button ml-3 p-3">
                        back to /{subreddit.name}
                    </button>
                </Link>
            </div>
            <div className="contentbox mx-10">
                <div className="flex items-center main-contrast">
                    Posted by {post.author.name}{" "}
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
            {session ? (
                <NewComment post={post} />
            ) : (
                <Link href="/api/auth/signin">
                    <button className="button ml-10 p-3">
                        Login to comment
                    </button>
                </Link>
            )}
        </>
    )
}

export async function getServerSideProps({ params }) {
    const subreddit = await getSubreddit(params.subreddit, prisma)
    let post = await getPost(parseInt(params.id), prisma)
    post = JSON.parse(JSON.stringify(post))

    return {
        props: {
            subreddit,
            post,
        },
    }
}
