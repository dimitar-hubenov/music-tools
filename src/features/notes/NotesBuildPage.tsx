import { useParams } from "react-router-dom"
import NotesGuessGame from "./NotesGuessGame"

export default function NotesBuildPage() {
    const { mode } = useParams()

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">
                Notes Trainer
            </h1>

            {mode === "guess" && (
                <NotesGuessGame clef="treble" />
            )}
        </div>
    )
}
