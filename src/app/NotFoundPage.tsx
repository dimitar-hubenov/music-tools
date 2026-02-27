import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>

            <p className="mt-4 text-xl">Page not found</p>

            <p className="text-zinc-400 mt-2">
                The link may be incorrect or expired.
            </p>

            <Link
                to="/"
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
                Go Home
            </Link>
        </div>
    )
}
