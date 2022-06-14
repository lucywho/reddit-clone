import Head from "next/head"
import Link from "next/link"
import { getPosts } from "lib/data.js"
import prisma from "lib/prisma"
import Posts from "components/Posts"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Home({ posts }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const loading = status === "loading"

    if (loading) {
        return <p className="p-10 text-teal-800">...loading</p>
    }

    if (session && !session.user.name) {
        router.push("/setup")
    }

    return (
        <>
            <Head>
                <title>Skimmdit</title>
                <meta name="description" content="Like Reddit but Worse!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <h1 className="title">Skimmdit</h1>
                <p className="tagline">Like Reddit but Worse!</p>
                <div className="strapline">
                    <Link
                        href={session ? "/api/auth/signout" : "api/auth/signin"}
                    >
                        <button className="button">
                            {session ? "logout" : "login"}
                        </button>
                    </Link>
                </div>
            </header>
            <Posts posts={posts} />
        </>
    )
}

export async function getServerSideProps() {
    let posts = await getPosts(prisma)
    posts = JSON.parse(JSON.stringify(posts))

    return {
        props: {
            posts: posts,
        },
    }
}
