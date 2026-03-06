// src/features/notes/NotesGuessPage.tsx

import { useSearchParams } from "react-router-dom"
import { notesConfigFromUrl } from "./notesConfig"
import type { NotesExerciseConfig } from "./notesConfig"
import NotesGuessGame from "./NotesGuessGame"

export default function NotesGuessPage() {
    const [searchParams] = useSearchParams()
    const config: NotesExerciseConfig = notesConfigFromUrl(searchParams)

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
