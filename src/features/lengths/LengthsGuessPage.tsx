// src/features/lengths/LengthsGuessPage.tsx

import { useSearchParams } from "react-router-dom"
import { lengthsConfigFromUrl } from "./lengthsConfig"
import type { LengthsExerciseConfig } from "./lengthsConfig"
import LengthsGuessGame from "./LengthsGuessGame"

export default function LengthsGuessPage() {
    const [searchParams] = useSearchParams()
    const config: LengthsExerciseConfig = lengthsConfigFromUrl(searchParams)

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">
                Guess the Length
            </h1>

            <LengthsGuessGame config={config}
            />
        </div>
    )
}
