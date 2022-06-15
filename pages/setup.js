import { useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Loading from "components/Loading"

export default function Setup() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === "loading"

    const [name, setName] = useState("")

    if (loading) return <Loading />

    if (!session || !session.user) {
        router.push("/")
        return null
    }

    if (!loading && session && session.user.name) {
        router.push("/")
    }

    return (
        <form
            className="mt-10 mx-auto w-5/6"
            onSubmit={async (e) => {
                e.preventDefault()
                await fetch("/api/setup", {
                    body: JSON.stringify({
                        name,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                })
                session.user.name = name
                router.push("/")
            }}
        >
            <div className="flex-1 p-5">
                <div className="flex-1 mb-5 main-color font-bold">
                    Choose a username
                </div>
                <input
                    type="text"
                    name="name"
                    className="p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    pattern="\w*"
                    title="Numbers or letters or _ only"
                    placeholder="Numbers or letters or _ only"
                    minLength="5"
                />
            </div>

            <button className="button ml-5 mb-5">Save</button>
        </form>
    )
}
