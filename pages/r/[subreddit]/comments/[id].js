import Link from "next/link"
import { useRouter } from "next/router"
import { getSession, useSession } from "next-auth/react"
import timeago from "lib/timeago"
import prisma from "lib/prisma"
import { getPost, getSubreddit, getVote, getVotes } from "lib/data.js"
import NewComment from "components/NewComment"
import Loading from "components/Loading"
import Comments from "components/Comments"

export default function Post({ subreddit, post, votes, vote }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    const loading = status === "loading"

    const sendVote = async (up) => {
        await fetch("/api/vote", {
            body: JSON.stringify({
                post: post.id,
                up,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })

        router.reload(window.location.pathname)
    }

    if (loading) {
        return <Loading />
    }

    if (!post) {
        return (
            <>
                <p className="strapline">
                    {" "}
                    <span className=" font-extrabold text-lg">
                        this post does not exist
                    </span>
                    <Link href={`/`}>
                        <button className=" strapline-link">
                            {" "}
                            back to the homepage
                        </button>
                    </Link>
                    <Link
                        href={session ? "/api/auth/signout" : "api/auth/signin"}
                    >
                        <button className="strapline-link">
                            {session ? "logout" : "login"}
                        </button>
                    </Link>
                </p>
            </>
        )
    }

    return (
        <>
            <p className="strapline">
                {" "}
                <span className="text-lg font-bold">{post.title}</span>
                <Link href={`/r/${subreddit.name}`}>
                    <button className="strapline-link">
                        back to /{subreddit.name}
                    </button>
                </Link>
                <Link href={`/`}>
                    <button className="strapline-link">
                        {" "}
                        back to the homepage
                    </button>
                </Link>
                <Link href={session ? "/api/auth/signout" : "api/auth/signin"}>
                    <button className="strapline-link">
                        {session ? "logout" : "login"}
                    </button>
                </Link>
            </p>
            <div className="flex flex-row mt-10"></div>

            <div className=" flex flex-row  items-center ">
                <div className=" h-auto w-6 flex flex-col justify-around items-center ml-10">
                    <div
                        className="cursor-pointer text-4xl main-color"
                        onClick={async (e) => {
                            e.preventDefault()
                            sendVote(true)
                        }}
                    >
                        {vote?.up ? "⬆" : "↑"}
                    </div>
                    <div className="text-4xl input rounded-full px-3 py-2">
                        {votes}
                    </div>
                    <div
                        className="cursor-pointer text-4xl main-contrast"
                        onClick={async (e) => {
                            e.preventDefault()
                            sendVote(false)
                        }}
                    >
                        {!vote ? "↓" : vote?.up ? "↓" : "⬇"}
                    </div>
                </div>
                <div className="contentbox mx-10 w-full">
                    <div className="flex items-center main-contrast">
                        <Link href={`/u/${post.author.name}`}>
                            <span className="hover:underline">
                                Posted by {post.author.name}{" "}
                            </span>
                        </Link>
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
            </div>
            <Comments comments={post.comments} post={post} />

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

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const subreddit = await getSubreddit(context.params.subreddit, prisma)
    let post = await getPost(parseInt(context.params.id), prisma)
    post = JSON.parse(JSON.stringify(post))

    let votes = await getVotes(parseInt(context.params.id), prisma)
    votes = JSON.parse(JSON.stringify(votes))

    let vote = await getVote(
        parseInt(context.params.id),
        session?.user.id,
        prisma
    )
    vote = JSON.parse(JSON.stringify(vote))

    return {
        props: {
            subreddit,
            post,
            vote,
            votes,
        },
    }
}
