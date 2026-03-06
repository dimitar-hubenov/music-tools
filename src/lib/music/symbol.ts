import type { Duration, SpelledNote } from "."

export type MusicSymbol =
    | {
        type: "note"
        pitch: SpelledNote
        duration: Duration
    }
    | {
        type: "rest"
        duration: Duration
    }
