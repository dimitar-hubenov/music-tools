// src/features/notes/notesConfig.ts

import { 
    type Clef, 
    parseClef, 
    type NotesSource, 
    parseNotesParam,
    type AccidentalsMode,
    parseAccidentalsParam,
    type NamingSystem,
    parseNamingSystem
} from "../../lib/music"

export interface NotesExerciseConfig {
    clef: Clef
    notes: NotesSource
    accidentals: AccidentalsMode
    naming: NamingSystem
}

export function notesConfigFromUrl(
    params: URLSearchParams
): NotesExerciseConfig {
    const notes = parseNotesParam(params.get("notes"))

    const accidentals =
        notes.type === "range"
            ? parseAccidentalsParam(params.get("acc"))
            : "off" // ignored for list

    return {
        clef: parseClef(params.get("clef")),
        notes,
        accidentals,
        naming: parseNamingSystem(params.get("names"))
    }
}
