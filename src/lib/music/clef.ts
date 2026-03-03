// src/types/clef.ts

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
