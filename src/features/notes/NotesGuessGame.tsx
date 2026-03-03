// src/features/notes/NotesGuessGame.tsx

import { useState } from "react"
import { Link } from "react-router-dom"

import type { NotesExerciseConfig } from "./config"
import { expandNotesSource, randomFromPool, type SpelledNote, spellMidi } from "../../lib/music"
import { clefToVexflow, spelledToVexflow } from "../../lib/music/vexflow"

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

    const [target, setTarget] = useState<SpelledNote>(() =>
        spellMidi(randomFromPool(pool), config.accidentals)
    )

    const [feedback, setFeedback] = useState<{
        correct?: number
        wrong?: number
        target?: number
    } | null>(null)

    function nextQuestion() {
        const nextMidi = randomFromPool(pool, target?.midi)
        setTarget(spellMidi(nextMidi, config.accidentals))
        setFeedback(null)
    }

    function evaluateUserInput(midi: number): boolean {
        if (!target) return false

        const isCorrect = midi % 12 === target.midi % 12

        if (isCorrect) {
            setFeedback({
                correct: midi,
                target: target.midi
            })
        } else {
            setFeedback({
                wrong: midi,
                target: target.midi
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

    const vf = spelledToVexflow(target)

    const isGrand = config.clef === "grand"

    return (
        <div className="space-y-6">
            {isGrand ? (
                <PianoStaff
                    trebleNote={target.midi >= 60 ? vf.key : undefined}
                    trebleAccidental={target.midi >= 60 ? vf.accidental : undefined}
                    bassNote={target.midi < 60 ? vf.key : undefined}
                    bassAccidental={target.midi < 60 ? vf.accidental : undefined}
                />
            ) : (
                <Staff
                    clef={clefToVexflow(config.clef)}
                    note={vf.key}
                    accidental={vf.accidental}
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
