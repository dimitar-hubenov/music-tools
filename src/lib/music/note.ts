// src/lib/music/note.ts

import type { Pitch, Natural, Accidental } from "./theory"

export interface Note {
    pitch: Pitch
    octave: number
}

export interface NoteRange {
    from: Note
    to: Note
}

const NOTE_REGEX = /^([A-Ga-g])(bb|##|b|#|n)?(\d+)$/

export function parseNote(value: string): Note {
    const match = value.trim().match(NOTE_REGEX)

    if (!match) {
        throw new Error(`Invalid note: ${value}`)
    }

    const [, naturalRaw, accidentalRaw, octaveRaw] = match

    const natural = naturalRaw.toUpperCase() as Natural
    const accidental =
        accidentalRaw === undefined || accidentalRaw === ""
            ? undefined
            : (accidentalRaw as Accidental)

    const octave = Number(octaveRaw)

    return {
        pitch: {
            natural,
            accidental,
        },
        octave,
    }
}


export type NotesSource =
    | { type: "range"; range: NoteRange }
    | { type: "list"; notes: Note[] }

export function parseNotesParam(value: string | null): NotesSource {
    // default C4–C5
    if (!value) {
        return {
            type: "range",
            range: {
                from: parseNote("C4"),
                to: parseNote("C5"),
            },
        }
    }

    const trimmed = value.trim()

    // RANGE: C4-C5
    if (trimmed.includes("-")) {
        const [fromStr, toStr] = trimmed.split("-").map(s => s.trim())

        return {
            type: "range",
            range: {
                from: parseNote(fromStr),
                to: parseNote(toStr),
            },
        }
    }

    // LIST: C4,E4,G4
    const notes = trimmed
        .split(",")
        .map(n => parseNote(n))

    return {
        type: "list",
        notes,
    }
}

export function noteToString(note: Note): string {
    const acc = note.pitch.accidental ?? ""
    return `${note.pitch.natural}${acc}${note.octave}`
}
