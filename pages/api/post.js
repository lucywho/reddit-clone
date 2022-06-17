import prisma from "lib/prisma"
import { getSession } from "next-auth/react"
import middleware from 'middleware/middleware'
import nextConnect from 'next-connect'

const handler = nextConnect()
handler.use(middleware)

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(501).end()
    }

    const session = await getSession({ req })

    if (!session) return res.status(401).json({ message: "not logged in" })

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    })

    if (!user) return res.status(401).json({ message: "user not found" })

    if (req.method === "POST") {
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                subreddit: {
                    connect: {
                        name: req.body.subreddit_name,
                    },
                },
                author: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        })
        res.json(post)
        return
    }
}
