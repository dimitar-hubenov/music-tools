// src/features/lengths/LengthsGuessGame.tsx

import { useState } from "react"
import { Link } from "react-router-dom"

import type { LengthsExerciseConfig } from "./lengthsConfig"

import { randomLengthSymbol } from "./randomLengthSymbol"

import {
    expandDurationsSource,
    expandNotesSource,
    type Duration,
    durationName,
    type MusicSymbol
} from "../../lib/music"

import Staff from "../../components/Staff"

interface Props {
    config: LengthsExerciseConfig
}

export default function LengthsGuessGame({ config }: Props) {

    const notePool = config?.notes
        ? expandNotesSource(config.notes, config.accidentals)
        : []

    const durationPool = expandDurationsSource(config.durations)

    const [target, setTarget] = useState<MusicSymbol>(() =>
        randomLengthSymbol(config, notePool, durationPool)
    )

    const [feedback, setFeedback] = useState<{
        correct?: Duration
        wrong?: Duration
        target?: Duration
    } | null>(null)

    function nextQuestion() {
        setTarget(randomLengthSymbol(config, notePool, durationPool))
        setFeedback(null)
    }

    function evaluateUserInput(duration: Duration): boolean {

        const isCorrect = duration === target.duration

        if (isCorrect) {
            setFeedback({
                correct: duration,
                target: target.duration
            })
        } else {
            setFeedback({
                wrong: duration,
                target: target.duration
            })
        }

        return isCorrect
    }

    function handlePress(duration: Duration) {
        evaluateUserInput(duration)
    }

    function handleInput(duration: Duration) {

        const isCorrect = evaluateUserInput(duration)

        if (isCorrect) {
            setTimeout(() => {
                setFeedback(null)
                nextQuestion()
            }, 700)
        }
    }

    return (
        <div className="space-y-6">

            <Staff
                clef={config.clef}
                target={target}
            />

            <div className="flex flex-wrap gap-3">

                {durationPool.map((duration) => {

                    const isCorrect = feedback?.correct === duration
                    const isWrong = feedback?.wrong === duration

                    return (
                        <button
                            key={duration}
                            onMouseDown={() => handlePress(duration)}
                            onClick={() => handleInput(duration)}
                            className={[
                                "px-4 py-2 rounded font-medium border",
                                "transition-colors",
                                isCorrect && "bg-green-500 text-white",
                                isWrong && "bg-red-500 text-white",
                                !isCorrect && !isWrong && "bg-white hover:bg-gray-100"
                            ].join(" ")}
                        >
                            {durationName(duration)}
                        </button>
                    )
                })}

            </div>

            <div className="flex gap-3">

                <Link
                    to="/"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Go Home
                </Link>

                <button
                    onClick={nextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                    Next
                </button>

            </div>

        </div>
    )
}
