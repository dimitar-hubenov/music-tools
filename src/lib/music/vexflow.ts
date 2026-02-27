// src/lib/music/vexflow.ts

import type { Clef } from "./clef"
import type { SpelledNote } from "./pool"

/**
 * Convert our Clef type to VexFlow clef string
 */
export function clefToVexflow(clef: Clef): string {
    return clef
}

/**
 * Convert a MIDI note number to a VexFlow note key + accidental
 */
export function spelledToVexflow(note: SpelledNote) {
    const letter = note.name[0].toLowerCase()
    const octave = note.name.slice(-1)
    const accidental =
        note.name.includes("#") ? "#" :
            note.name.includes("b") ? "b" :
                undefined

    return {
        key: letter + "/" + octave,
        accidental
    }
}