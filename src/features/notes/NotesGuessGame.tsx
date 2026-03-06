// src/features/notes/NotesGuessGame.tsx

import { useState } from "react"
import { Link } from "react-router-dom"

import type { NotesExerciseConfig } from "./notesConfig"
import { 
    expandNotesSource, 
    type MusicSymbol, 
    randomFromPool,
    spellMidi
} from "../../lib/music"

import Staff from "../../components/Staff"
import PianoStaff from "../../components/PianoStaff"
import PianoKeyboard from "../../components/Piano/PianoKeyboard"


interface Props {
    config: NotesExerciseConfig
}

export default function NotesGuessGame({ config }: Props) {
    const pool = config?.notes
        ? expandNotesSource(config.notes, config.accidentals)
        : []

    const [target, setTarget] = useState<MusicSymbol>(() => ({
        type: "note",
        pitch: spellMidi(randomFromPool(pool), config.accidentals),
        duration: 4
    }))

    const [feedback, setFeedback] = useState<{
        correct?: number
        wrong?: number
        target?: number
    } | null>(null)

    function nextQuestion() {
        const previousMidi =
            target.type === "note"
                ? target.pitch.midi
                : undefined

        const nextMidi = randomFromPool(pool, previousMidi)

        setTarget({
            type: "note",
            pitch: spellMidi(nextMidi, config.accidentals),
            duration: 4
        })

        setFeedback(null)
    }

    function evaluateUserInput(midi: number): boolean {
        if (target.type !== "note") return false

        const targetMidi = target.pitch.midi
        const isCorrect = midi % 12 === targetMidi % 12

        if (isCorrect) {
            setFeedback({
                correct: midi,
                target: targetMidi
            })
        } else {
            setFeedback({
                wrong: midi,
                target: targetMidi
            })
        }

        return isCorrect
    }

    function handlePress(midi: number) {
        evaluateUserInput(midi)
    }

    function handleInput(midi: number) {
        const isCorrect = evaluateUserInput(midi)

        if (isCorrect) {
            setTimeout(() => {
                setFeedback(null)
                nextQuestion()
            }, 700)
        }
    }

    if (target == null) return null

    const isGrand = config.clef === "grand"

    return (
        <div className="space-y-6">
            {isGrand ? (
                <PianoStaff 
                    target={target}
                />
            ) : (
                <Staff
                    clef={config.clef}
                    target={target}
                />
            )}

            <PianoKeyboard
                lowMidi={60}
                highMidi={71}
                onPress={handlePress}
                onNote={handleInput}
                highlighted={feedback?.correct ? [feedback.correct] : []}
                wrong={feedback?.wrong ? [feedback.wrong] : []}
                naming={config.naming}
            />

            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
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
    )
}
