// src/lib/music/theory.ts

export const NATURAL_NAMES = [
    "C", "D", "E", "F", "G", "A", "B"
] as const

export type Natural = typeof NATURAL_NAMES[number]

// Diatonic index (0–6)
const NATURAL_INDEX: Record<Natural, number> =
    Object.fromEntries(
        NATURAL_NAMES.map((n, i) => [n, i])
    ) as Record<Natural, number>

export function getNaturalIndex(natural: Natural): number {
    return NATURAL_INDEX[natural]
}

// Base pitch class for naturals
export const NATURAL_PITCH_CLASSES: Record<Natural, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
}

export type Accidental =
    | "bb"
    | "b"
    | "n"
    | "#"
    | "##"

export interface Pitch {
    natural: Natural
    accidental?: Accidental
}

/**
 * All enharmonic spellings per pitch class (0–11)
 */
export const PITCH_CLASS_SPELLINGS: Record<number, Pitch[]> = {
    0: [
        { natural: "C" },
        { natural: "B", accidental: "#" },
        { natural: "D", accidental: "bb" }
    ],
    1: [
        { natural: "C", accidental: "#" },
        { natural: "D", accidental: "b" }
    ],
    2: [
        { natural: "D" },
        { natural: "C", accidental: "##" },
        { natural: "E", accidental: "bb" }
    ],
    3: [
        { natural: "D", accidental: "#" },
        { natural: "E", accidental: "b" }
    ],
    4: [
        { natural: "E" },
        { natural: "F", accidental: "b" },
        { natural: "D", accidental: "##" }
    ],
    5: [
        { natural: "F" },
        { natural: "E", accidental: "#" },
        { natural: "G", accidental: "bb" }
    ],
    6: [
        { natural: "F", accidental: "#" },
        { natural: "G", accidental: "b" }
    ],
    7: [
        { natural: "G" },
        { natural: "F", accidental: "##" },
        { natural: "A", accidental: "bb" }
    ],
    8: [
        { natural: "G", accidental: "#" },
        { natural: "A", accidental: "b" }
    ],
    9: [
        { natural: "A" },
        { natural: "G", accidental: "##" },
        { natural: "B", accidental: "bb" }
    ],
    10: [
        { natural: "A", accidental: "#" },
        { natural: "B", accidental: "b" }
    ],
    11: [
        { natural: "B" },
        { natural: "C", accidental: "b" },
        { natural: "A", accidental: "##" }
    ]
}

/**
 * Returns true if pitch class has a natural spelling
 */
export function isNatural(pc: number): boolean {
    const normalized = normalizePitchClass(pc)
    return PITCH_CLASS_SPELLINGS[normalized]
        .some(p => !p.accidental)
}

/**
 * Returns true if pitch class has any accidental spelling
 */
export function isAccidental(pc: number): boolean {
    const normalized = normalizePitchClass(pc)
    return PITCH_CLASS_SPELLINGS[normalized]
        .some(p => p.accidental)
}

/**
 * Format pitch class into string name (e.g. "F#", "Gb", "Cb", "E##")
 */
export function formatPitchClass(
    pc: number,
    prefer: "sharp" | "flat" = "sharp",
    allowDoubles = false
): string {

    const normalized = normalizePitchClass(pc)
    const options = PITCH_CLASS_SPELLINGS[normalized]

    const filtered = allowDoubles
        ? options
        : options.filter(o =>
            !o.accidental || o.accidental.length === 1
        )

    let chosen: Pitch | undefined

    if (prefer === "sharp") {
        chosen =
            filtered.find(o => o.accidental?.includes("#")) ??
            filtered.find(o => !o.accidental)
    } else {
        chosen =
            filtered.find(o => o.accidental?.includes("b")) ??
            filtered.find(o => !o.accidental)
    }

    chosen ??= filtered[0]

    return chosen.natural + (chosen.accidental ?? "")
}

/**
 * Convert (natural + accidental) to pitch class
 */
export function transposePitchClass(
    natural: Natural,
    accidental?: Accidental
): number {

    let pc = NATURAL_PITCH_CLASSES[natural]

    switch (accidental) {
        case "bb": pc -= 2; break
        case "b": pc -= 1; break
        case "#": pc += 1; break
        case "##": pc += 2; break
        case "n":
        case undefined:
            break
    }

    return normalizePitchClass(pc)
}

/**
 * Normalize pitch class to 0–11
 */
export function normalizePitchClass(pc: number): number {
    return ((pc % 12) + 12) % 12
}

/**
 * Duration values
 */

export const DURATIONS = [
    1,    // whole note
    2,    // half note
    4,    // quarter note
    8,    // eighth note
    16,   // sixteenth note
    32,   // thirty-second note
    64    // sixty-fourth note
] as const

export type Duration = typeof DURATIONS[number]
