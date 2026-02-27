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

export interface PitchClass {
    pc: number              // 0–11
    natural: Natural
    accidental?: Accidental
}

export const PITCH_CLASSES: Record<number, PitchClass> = {
    0: { pc: 0, natural: "C" },
    1: { pc: 1, natural: "C", accidental: "#" },
    2: { pc: 2, natural: "D" },
    3: { pc: 3, natural: "D", accidental: "#" },
    4: { pc: 4, natural: "E" },
    5: { pc: 5, natural: "F" },
    6: { pc: 6, natural: "F", accidental: "#" },
    7: { pc: 7, natural: "G" },
    8: { pc: 8, natural: "G", accidental: "#" },
    9: { pc: 9, natural: "A" },
    10: { pc: 10, natural: "A", accidental: "#" },
    11: { pc: 11, natural: "B" },
}

const FLAT_EQUIVALENTS: Record<number, PitchClass> = {
    0: { pc: 0, natural: "C" },
    1: { pc: 1, natural: "D", accidental: "b" },
    2: { pc: 2, natural: "D" },
    3: { pc: 3, natural: "E", accidental: "b" },
    4: { pc: 4, natural: "E" },
    5: { pc: 5, natural: "F" },
    6: { pc: 6, natural: "G", accidental: "b" },
    7: { pc: 7, natural: "G" },
    8: { pc: 8, natural: "A", accidental: "b" },
    9: { pc: 9, natural: "A" },
    10: { pc: 10, natural: "B", accidental: "b" },
    11: { pc: 11, natural: "B" },
}

export function toFlat(pc: number): PitchClass {
    return FLAT_EQUIVALENTS[normalizePitchClass(pc)]
}

export function isNatural(pc: number): boolean {
    return !PITCH_CLASSES[normalizePitchClass(pc)].accidental
}

export function isAccidental(pc: number): boolean {
    return !!PITCH_CLASSES[normalizePitchClass(pc)].accidental
}

export function formatPitchClass(
    pc: number,
    prefer: "sharp" | "flat" = "sharp"
): string {
    const normalized = normalizePitchClass(pc)

    const pitch =
        prefer === "flat"
            ? toFlat(normalized)
            : PITCH_CLASSES[normalized]

    return pitch.natural + (pitch.accidental ?? "")
}

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
 * Normalize a pitch class number to 0–11
 */
export function normalizePitchClass(pc: number): number {
    return ((pc % 12) + 12) % 12
}