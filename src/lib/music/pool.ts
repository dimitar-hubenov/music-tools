// src/lib/music/pool.ts

import { 
    formatPitchClass, 
    isNatural, 
    normalizePitchClass, 
    PITCH_CLASS_SPELLINGS, 
    DURATIONS, 
    type Duration 
} from "./theory"
import { parseNote, type NotesSource } from "./note"
import type { AccidentalsMode } from "./accidentalsMode"
import { noteToMidi } from "./midi"
import type { DurationsSource } from "./duration"

export type SpelledNote = {
    midi: number
    name: string
}

function filterByAccidentals(
    midi: number,
    mode: AccidentalsMode
): boolean {

    const pc = normalizePitchClass(midi)

    if (mode === "off") {
        return isNatural(pc)
    }

    // on | sharp | flat → include everything
    return true
}

export function expandNotesSource(
    source: NotesSource,
    accidentals: AccidentalsMode
): number[] {

    if (source.type === "list") {
        return source.notes.map(noteToMidi)
    }

    const fromMidi = noteToMidi(source.range.from)
    const toMidi = noteToMidi(source.range.to)

    const pool: number[] = []

    for (let midi = fromMidi; midi <= toMidi; midi++) {
        if (filterByAccidentals(midi, accidentals)) {
            pool.push(midi)
        }
    }

    return pool
}

export function randomFromPool(
    pool: number[],
    previous?: number
): number {

    if (pool.length === 0) {
        throw new Error("Pool is empty")
    }

    if (pool.length === 1) {
        return pool[0]
    }

    const candidates =
        previous === undefined
            ? pool
            : pool.filter(n => n !== previous)

    return candidates[
        Math.floor(Math.random() * candidates.length)
    ]
}

export function spelled(noteStr: string): SpelledNote {
    const note = parseNote(noteStr)

    return {
        midi: noteToMidi(note),
        name: noteStr
    }
}

export function spellMidi(
    midi: number,
    mode: AccidentalsMode
): SpelledNote {

    const pc = normalizePitchClass(midi)
    const octave = Math.floor(midi / 12) - 1

    if (mode === "off") {
        const natural = PITCH_CLASS_SPELLINGS[pc]
            .find(p => !p.accidental)

        if (!natural) {
            throw new Error(`Pitch class ${pc} has no natural spelling`)
        }

        return {
            midi,
            name: natural.natural + octave
        }
    }

    let prefer: "flat" | "sharp"

    if (mode === "flat") {
        prefer = "flat"
    } else if (mode === "sharp") {
        prefer = "sharp"
    } else {
        // mode === "on" → random choice
        prefer = Math.random() < 0.5 ? "flat" : "sharp"
    }

    return {
        midi,
        name: formatPitchClass(pc, prefer) + octave
    }
}

export function expandDurationsSource(
    source: DurationsSource
): Duration[] {

    if (source.type === "list") {
        return source.durations
    }

    const fromIndex = DURATIONS.indexOf(source.range.from)
    const toIndex = DURATIONS.indexOf(source.range.to)

    return DURATIONS.slice(fromIndex, toIndex + 1)
}