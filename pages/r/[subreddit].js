import Link from "next/link"
import { useSession } from "next-auth/react"
import prisma from "lib/prisma"
import { getSubreddit, getPostsFromSubreddit } from "lib/data.js"
import Loading from "components/Loading"
import Posts from "components/Posts"

export default function Subreddit({ subreddit, posts }) {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    if (loading) {
        return <Loading />
    }

    if (!subreddit) {
        return (
            <>
                <p className="strapline">
                    {" "}
                    <span className=" font-extrabold text-lg">
                        this subskimmdit does not exist
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
                <span className="text-lg font-bold">
                    {subreddit.description}
                </span>
                <Link href={`/r/${subreddit.name}/submit`}>
                    <button className="strapline-link">
                        {" "}
                        create a new post
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
            <p className="title">/r/{subreddit.name}</p>

            <Posts posts={posts} />
        </>
    )
}

export async function getServerSideProps({ params }) {
    const subreddit = await getSubreddit(params.subreddit, prisma)
    let posts = await getPostsFromSubreddit(params.subreddit, prisma)
    posts = JSON.parse(JSON.stringify(posts))

    return {
        props: {
            subreddit,
            posts,
        },
    }
}
