// src/lib/music/interval.ts

import { type Natural, getNaturalIndex } from "./theory"

export type IntervalQuality =
    | "perfect"
    | "major"
    | "minor"
    | "augmented"
    | "diminished"

export interface Interval {
    quality: IntervalQuality
    number: number
}

export function intervalNumber(from: Natural, to: Natural) {
    return (
        (getNaturalIndex(to) -
            getNaturalIndex(from) + 7) % 7
    ) + 1
}
