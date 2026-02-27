// src/lib/music/midi.ts

import type { Note } from "./note"
import {
    transposePitchClass,
    formatPitchClass,
    normalizePitchClass
} from "./theory"

export function noteToMidi(note: Note): number {

    const pc = transposePitchClass(
        note.pitch.natural,
        note.pitch.accidental
    )

    return (note.octave + 1) * 12 + pc
}

export function midiToNote(
    midi: number,
    prefer: "sharp" | "flat" = "sharp"
): string {

    const normalized = normalizePitchClass(midi)
    const octave = Math.floor(midi / 12) - 1

    return formatPitchClass(normalized, prefer) + octave
}
