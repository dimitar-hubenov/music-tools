// src/lib/music/accidentals.ts

export type AccidentalsMode =
    | "off"
    | "on"
    | "sharp"
    | "flat"

export function parseAccidentalsParam(value: string | null): AccidentalsMode {
    if (!value) return "on"

    if (value === "on") return "on"
    if (value === "off") return "off"
    if (value === "sharp") return "sharp"
    if (value === "flat") return "flat"

    return "on"
}
