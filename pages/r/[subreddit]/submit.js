import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { getSubreddit } from "lib/data.js"
import prisma from "lib/prisma"
import Loading from "components/Loading"

export default function NewPost({ subreddit }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const loading = status === "loading"
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(null)

    if (loading) {
        return <Loading />
    }

    if (session && !session.user.name) {
        router.push("/setup")
    }

    if (!session)
        return (
            <>
                <p className="strapline">
                    <div className="strap-left">
                        {" "}
                        <span className=" font-extrabold text-lg">
                            you must be logged in to post
                        </span>
                    </div>
                    <div className="strap-right">
                        <Link href={`/`}>
                            <button className=" ml-10 strapline-link">
                                {" "}
                                back to the homepage
                            </button>
                        </Link>
                        <Link
                            href={
                                session
                                    ? "/api/auth/signout"
                                    : "api/auth/signin"
                            }
                        >
                            <button className="strapline-link">
                                {session ? "logout" : "login"}
                            </button>
                        </Link>
                    </div>
                </p>
            </>
        )

    if (!subreddit) {
        return (
            <>
                <p className="strapline">
                    {" "}
                    <div className="strap-left">
                        <span className=" font-extrabold text-lg">
                            this subskimmdit does not exist
                        </span>
                    </div>
                    <div className="strap-right">
                        <Link href={`/`}>
                            <button className=" ml-10 strapline-link">
                                {" "}
                                back to the homepage
                            </button>
                        </Link>
                        <Link
                            href={
                                session
                                    ? "/api/auth/signout"
                                    : "api/auth/signin"
                            }
                        >
                            <button className="strapline-link">
                                {session ? "logout" : "login"}
                            </button>
                        </Link>
                    </div>
                </p>
            </>
        )
    }

    return (
        <>
            <p className="strapline">
                <div className="strap-left">
                    <span className=" font-extrabold text-lg">
                        {subreddit.description}
                    </span>
                </div>
                <div className="strap-right">
                    <Link href={`/`}>
                        <button className="strapline-link">
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
                </div>
            </p>
            <p className="title">/r/{subreddit.name}</p>

            <form
                className="flex flex-col mt-10"
                onSubmit={async (e) => {
                    e.preventDefault()

                    if (!title) {
                        alert("Enter a title")
                        return
                    }

                    if (!content && !image) {
                        alert("Enter some text")
                        return
                    }

                    const body = new FormData()
                    body.append("image", image)
                    body.append("title", title)
                    body.append("content", content)
                    body.append("subreddit_name", subreddit.name)

                    const res = await fetch("/api/post", {
                        body,
                        method: "POST",
                    })
                    router.push(`/r/${subreddit.name}`)
                }}
            >
                <input
                    className="input  mx-10 mb-2 p-5"
                    rows={1}
                    cols={50}
                    placeholder="Give your post a title"
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="input mx-10 p-5"
                    rows={5}
                    cols={50}
                    placeholder="Add content"
                    onChange={(e) => setContent(e.target.value)}
                />
                <label className="button mx-10 mt-3 px-6 py-3 max-w-fit">
                    {!imageURL && <p>Upload an image</p>}
                    <img src={imageURL} />
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                            if (event.target.files && event.target.files[0]) {
                                if (event.target.files[0].size > 3072000) {
                                    alert("Maximum file size is 3MB")
                                    return false
                                }
                                setImage(event.target.files[0])
                                setImageURL(
                                    URL.createObjectURL(event.target.files[0])
                                )
                            }
                        }}
                    />
                </label>
                <div className="mt-3 ml-10">
                    <button className="button px-6 py-3">Post</button>
                </div>
            </form>
        </>
    )
}

export async function getServerSideProps({ params }) {
    const subreddit = await getSubreddit(params.subreddit, prisma)

    return {
        props: {
            subreddit,
        },
    }
}
