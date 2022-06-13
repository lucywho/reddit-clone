export default function Utils() {
    const tasks = [
        { task: "generate_users", description: "Generate random users" },
        {
            task: "generate_subreddits",
            description: "Generate random subreddits",
        },
        {
            task: "add_fake_content",
            description: "Add fake content",
        },
        {
            task: "clean_database",
            description: "Clean the database",
        },
    ]

    const Button = ({ task }) => (
        <div className="flex-1 mb-5">
            <button
                className="utilsbut"
                onClick={async () => {
                    await fetch("/api/utils", {
                        body: JSON.stringify({
                            task: task.task,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                    })
                }}
            >
                {task.description}
            </button>
        </div>
    )

    return (
        <div className="mt-10 ml-20 title">
            <h2 className="mb-10 text-xl font-bold">Utils</h2>

            {tasks.map((task, index) => (
                <Button key={index} task={task} />
            ))}
        </div>
    )
}
