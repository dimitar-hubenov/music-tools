// src/lib/music/accidentals.ts

export const ACCIDENTALS_MODES = [
    "off",
    "on",
    "sharp",
    "flat"
] as const

export type AccidentalsMode = typeof ACCIDENTALS_MODES[number]

export function parseAccidentalsParam(
    value: string | null
): AccidentalsMode {

    if (!value) {
        return "on"
    }

    const normalized = value.trim().toLowerCase()

    if (ACCIDENTALS_MODES.includes(normalized as AccidentalsMode)) {
        return normalized as AccidentalsMode
    }

    throw new Error(`Invalid accidentals mode: ${value}`)
}