import Link from "next/link"
import { getSession, useSession } from "next-auth/react"
import prisma from "lib/prisma"
import { getUser, getPostsFromUser } from "lib/data"
import Posts from "components/Posts"

export default function Profile({ user, posts }) {
    const { data: session, status } = useSession()
    if (!user) {
        return (
            <>
                <p className="strapline">
                    {" "}
                    <span className=" font-extrabold text-lg">
                        this user does not exist
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
                    Welcome to{" "}
                    <span className="text-2xl">{user.name}&apos;s</span> page
                </span>
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
            <Posts posts={posts} />
        </>
    )
}

export async function getServerSideProps({ params }) {
    let user = await getUser(params.name, prisma)
    user = JSON.parse(JSON.stringify(user))

    let posts = await getPostsFromUser(params.name, prisma)
    posts = JSON.parse(JSON.stringify(posts))

    return {
        props: {
            user,
            posts,
        },
    }
}
