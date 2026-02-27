// src/features/notes/pages/NotesGuessPage.tsx
import { useSearchParams } from "react-router-dom"
import { configFromUrl } from "../config"
import type { NotesExerciseConfig } from "../config"
import NotesGuessGame from "../NotesGuessGame"

export default function NotesGuessPage() {
    const [searchParams] = useSearchParams()
    const config: NotesExerciseConfig = configFromUrl(searchParams)

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">
                Guess the Note
            </h1>

            <NotesGuessGame config={config}
            />
        </div>
    )
}
