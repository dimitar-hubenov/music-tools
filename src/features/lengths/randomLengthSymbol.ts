// src/features/lengths/randomLengthSymbol.ts

import { durationFromNumber, randomFromPool, spellMidi } from "../../lib/music"
import type { MusicSymbol } from "../../lib/music/symbol"
import type { LengthsExerciseConfig } from "./lengthsConfig"

export function randomLengthSymbol(
    config: LengthsExerciseConfig,
    notePool: number[],
    durationPool: number[]
): MusicSymbol {
    const duration = durationFromNumber(randomFromPool(durationPool))

    const mode = config.mode

    if (mode === "rests") {
        return {
            type: "rest",
            duration
        }
    }

    if (mode === "notes") {
        const midi = randomFromPool(notePool)
        return {
            type: "note",
            pitch: spellMidi(midi, config.accidentals),
            duration
        }
    }

    // mode = all
    const chooseRest = Math.random() < 0.5

    if (chooseRest) {
        return {
            type: "rest",
            duration
        }
    }

    const midi = randomFromPool(notePool)

    return {
        type: "note",
        pitch: spellMidi(midi, config.accidentals),
        duration
    }
}