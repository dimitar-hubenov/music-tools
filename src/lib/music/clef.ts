// src/types/clef.ts

import { type Note } from "./note"
import { type SpelledNote, spelled } from "./pool"
import { NATURAL_NAMES, getNaturalIndex, type Natural } from "./theory"

const CLEFS = [
    "treble",          // g on line 3
    "bass",            // f on line 1
    "alto",            // c on line 2
    "tenor",           // c on line 1
    "percussion",
    "soprano",         // c on line 4
    "mezzo-soprano",   // c on line 3
    "baritone-c",      // c on line 0
    "baritone-f",      // f on line 2
    "subbass",         // f on line 0
    "french",          // g on line 4
    "tab",             // six string tab
    "grand",           // treble and bass staves together, with brace
] as const

export type Clef = typeof CLEFS[number]

export function parseClef(value: string | null): Clef {
    if (!value) return "treble"

    if (CLEFS.includes(value as Clef)) {
        return value as Clef
    }

    return "treble"
}

interface ClefDefinition {
    middle: SpelledNote
}

const CLEF_INFO: Record<Exclude<Clef, "grand">, ClefDefinition> = {

    treble: { middle: spelled("B4") },
    bass: { middle: spelled("D3") },

    alto: { middle: spelled("C4") },
    tenor: { middle: spelled("A3") },

    soprano: { middle: spelled("G4") },
    "mezzo-soprano": { middle: spelled("E4") },

    "baritone-c": { middle: spelled("F3") },
    "baritone-f": { middle: spelled("B2") },

    subbass: { middle: spelled("F2") },

    french: { middle: spelled("D5") },

    percussion: { middle: spelled("B4") },
    tab: { middle: spelled("B4") }
}

export function diatonicPosition(note: SpelledNote): number {

    const name = note.name

    const letter = name[0] as Natural
    const octave = parseInt(name.slice(-1))

    return octave * 7 + getNaturalIndex(letter)
}
function positionToNote(pos: number): Note {

    const octave = Math.floor(pos / 7)

    const index = ((pos % 7) + 7) % 7

    return {
        pitch: {
            natural: NATURAL_NAMES[index]
        },
        octave
    }
}

export function getClefMiddleNote(clef: Clef): SpelledNote {

    if (clef === "grand") {
        return spelled("C4")
    }

    return { ...CLEF_INFO[clef].middle }

}

const LIMIT_OFFSET = 15

export interface ClefLimits {
    lowest: Note
    highest: Note
}

export function getClefLimits(clef: Clef): ClefLimits {

    if (clef === "grand") {

        const treble = getClefLimits("treble")
        const bass = getClefLimits("bass")

        return {
            lowest: bass.lowest,
            highest: treble.highest
        }
    }

    const middle = getClefMiddleNote(clef)
    const pos = diatonicPosition(middle)

    return {
        lowest: positionToNote(pos - LIMIT_OFFSET),
        highest: positionToNote(pos + LIMIT_OFFSET)
    }
}

export function stemUpForNote(
    note: SpelledNote,
    clef: Clef
): boolean {

    const middle = getClefMiddleNote(clef)

    return diatonicPosition(note) < diatonicPosition(middle)
}