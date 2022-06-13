import Head from "next/head"
import { getPosts } from "lib/data.js"
import prisma from "lib/prisma"
import Posts from "components/Posts"

export default function Home({ posts }) {
    return (
        <>
            <Head>
                <title>Skimmdit</title>
                <meta name="description" content="Like Reddit but Worse!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className="title">Skimmdit</h1>
            <p className="tagline">Like Reddit but Worse!</p>
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
