// src/lib/music/duration.ts

import { DURATIONS, type Duration } from "./theory"

export type DurationRange = {
    from: Duration
    to: Duration
}

export type DurationsSource =
    | { type: "range"; range: DurationRange }
    | { type: "list"; durations: Duration[] }

function parseDuration(value: string): Duration {
    const num = Number(value.trim())

    if (!DURATIONS.includes(num as Duration)) {
        throw new Error(`Invalid duration: ${value}`)
    }

    return num as Duration
}

export function parseDurationsParam(value: string | null): DurationsSource {

    // default: whole → eighth
    if (!value) {
        return {
            type: "range",
            range: { from: 1, to: 64 }
        }
    }

    const trimmed = value.trim()

    // RANGE: 1-8
    if (trimmed.includes("-")) {
        const [fromStr, toStr] = trimmed.split("-").map(s => s.trim())

        return {
            type: "range",
            range: {
                from: parseDuration(fromStr),
                to: parseDuration(toStr)
            }
        }
    }

    // LIST: 1,2,4
    const durations = trimmed
        .split(",")
        .map(d => parseDuration(d))

    return {
        type: "list",
        durations
    }
}

export function durationFromNumber(value: number): Duration {
    if (!DURATIONS.includes(value as Duration)) {
        throw new Error(`Invalid duration number: ${value}`)
    }
    return value as Duration
}

export function durationName(duration: Duration): string {
    switch (duration) {
        case 1: return "Whole"
        case 2: return "Half"
        case 4: return "Quarter"
        case 8: return "Eighth"
        case 16: return "Sixteenth"
        case 32: return "32nd"
        case 64: return "64th"
    }
}