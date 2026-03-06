// src/lib/music/noteRestMode.ts

export const NOTE_REST_MODES = [
    "notes",
    "rests",
    "all"
] as const

export type NoteRestMode = typeof NOTE_REST_MODES[number]

export function parseNoteRestModeParam(
    value: string | null
): NoteRestMode {

    if (!value) {
        return "all"
    }

    const normalized = value.trim().toLowerCase()

    if (NOTE_REST_MODES.includes(normalized as NoteRestMode)) {
        return normalized as NoteRestMode
    }

    throw new Error(`Invalid note/rest mode: ${value}`)
}