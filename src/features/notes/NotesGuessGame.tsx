// src/features/notes/NotesGuessGame.tsx

import { useState } from "react"
import { Link } from "react-router-dom"

import type { NotesExerciseConfig } from "./config"
import { expandNotesSource, randomFromPool, type SpelledNote, spellMidi } from "../../lib/music"
import { clefToVexflow, spelledToVexflow } from "../../lib/music/vexflow"

import Staff from "../../components/Staff"
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

    const [result, setResult] = useState<"correct" | "wrong" | null>(null)

    function next() {
        const nextMidi = randomFromPool(pool, target?.midi)
        setTarget(spellMidi(nextMidi, config.accidentals))
        setResult(null)
    }

    function handleInput(midi: number) {
        if (target == null) return

        const ok = midi % 12 === target.midi % 12

        setResult(ok ? "correct" : "wrong")
    }

    if (target == null) return null

    const vf = spelledToVexflow(target)

    console.log(target, vf);

    return (
        <div className="space-y-6">
            <Staff
                clef={clefToVexflow(config.clef)}
                note={vf.key}
                accidental={vf.accidental}
            />

            <PianoKeyboard 
                lowMidi={60}
                highMidi={71}
                onNote={handleInput}
                highlighted={[target.midi]}
                naming={config.naming} />

            {result && (
                <div
                    className={
                        result === "correct"
                            ? "text-green-400"
                            : "text-red-400"
                    }
                >
                    {result}
                </div>
            )}

            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2"
            >
                Go Home
            </Link>

            <button
                onClick={next}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
                Next
            </button>
        </div>
    )
}
