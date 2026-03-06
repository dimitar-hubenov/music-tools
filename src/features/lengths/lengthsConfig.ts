// src/features/lengths/lengthsConfig.ts

import { 
    type Clef, 
    parseClef, 
    type NotesSource, 
    parseNotesParam,
    type AccidentalsMode,
    parseAccidentalsParam,
    type DurationsSource,
    parseDurationsParam,
    type NoteRestMode,
    parseNoteRestModeParam
} from "../../lib/music"

export interface LengthsExerciseConfig {
    clef: Clef
    notes: NotesSource
    accidentals: AccidentalsMode
    durations: DurationsSource
    mode: NoteRestMode
}

export function lengthsConfigFromUrl(
    params: URLSearchParams
): LengthsExerciseConfig {
    return {
        clef: parseClef("treble"),
        notes: parseNotesParam("C4-A5"),
        accidentals: parseAccidentalsParam("off"),
        durations: parseDurationsParam(params.get("durations")),
        mode: parseNoteRestModeParam(params.get("mode"))
    }
}
