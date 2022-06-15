import Link from "next/link"

import prisma from "lib/prisma"
import { getSubreddit, getPostsFromSubreddit } from "lib/data.js"

import Posts from "components/Posts"

export default function Subreddit({ subreddit, posts }) {
    if (!subreddit) {
        return (
            <>
                <p className="p-10 main-contrast font-bold">
                    This subreddit does not exist
                </p>
                <Link href={`/`}>
                    <button className="button ml-10 p-3">
                        {" "}
                        back to the homepage
                    </button>
                </Link>
            </>
        )
    }

    return (
        <>
            <p className="title">/r/{subreddit.name}</p>
            <Link href={`/`}>
                <button className="button ml-10 p-3">
                    {" "}
                    back to the homepage
                </button>
            </Link>
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
