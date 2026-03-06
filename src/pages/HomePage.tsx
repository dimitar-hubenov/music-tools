import { Link } from "react-router-dom"

export default function HomePage() {
    return (
        <div className="p-8">
            <Link
                to="/notes/guess/?clef=treble&notes=C4-C5&names=solfege&acc=flat"
                className="bg-blue-600 px-4 py-2 rounded"
            >
                Guess the Note Name
            </Link>

            <Link
                to="/lengths/guess/?"
                className="bg-blue-600 px-4 py-2 rounded"
            >
                Guess the Note Length
            </Link>

            
        </div>
    )
}
