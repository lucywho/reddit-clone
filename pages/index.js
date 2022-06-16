import Head from "next/head"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import prisma from "lib/prisma"
import { getPosts } from "lib/data.js"
import Posts from "components/Posts"
import Loading from "components/Loading"

export default function Home({ posts }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const loading = status === "loading"

    if (loading) {
        return <Loading />
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
            <div className="strapline">
                <span className=" font-extrabold text-lg">
                    {session
                        ? "thanks for skimming today!"
                        : "log in to join in!"}
                </span>
                <Link href={session ? "/api/auth/signout" : "api/auth/signin"}>
                    <button className="strapline-link">
                        {session ? "logout" : "login"}
                    </button>
                </Link>
            </div>
            <header>
                <h1 className="title">Skimmdit</h1>
                <p className="tagline">Like Reddit but Worse!</p>
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
