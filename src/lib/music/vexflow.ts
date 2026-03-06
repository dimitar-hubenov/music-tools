// src/lib/music/vexflow.ts

import {
    StaveNote,
    Accidental,
    Voice,
    Formatter,
    Stem
} from "vexflow"

import type { Clef } from "./clef"
import type { SpelledNote } from "./pool"
import type { Duration } from "./theory"
import type { MusicSymbol } from "./symbol"
import { stemUpForNote } from "./clef"

/**
 * Convert our Clef type to VexFlow clef string
 */
export function clefToVexflow(clef: Clef): string {
    return clef
}

/**
 * Convert a MIDI note number to a VexFlow note key + accidental
 */
export function spelledToVexflow(note: SpelledNote) {
    const letter = note.name[0].toLowerCase()
    const octave = note.name.slice(-1)
    const accidental =
        note.name.includes("#") ? "#" :
            note.name.includes("b") ? "b" :
                undefined

    return {
        key: letter + "/" + octave,
        accidental
    }
}

const DURATION_MAP: Record<Duration, string> = {
    1: "w",
    2: "h",
    4: "q",
    8: "8",
    16: "16",
    32: "32",
    64: "64"
}

export function durationToVexflow(duration: Duration): string {
    return DURATION_MAP[duration]
}

export function durationToRest(duration: Duration): string {
    return durationToVexflow(duration) + "r"
}

/**
 * Adapter: converts array of LengthSymbols to a VexFlow Voice
 */
export function lengthSymbolsToVoice(
    symbols: MusicSymbol[],
    clef: Clef,
    numBeats = 4,
    beatValue = 4
): Voice {
    const voice = new Voice({ numBeats, beatValue }).setStrict(false)

    const tickables = symbols.map(symbol => {
        if (symbol.type === "rest") {
            return new StaveNote({
                keys: ["b/4"], // standard vertical placement for rests
                duration: durationToVexflow(symbol.duration) + "r",
                clef
            })
        }

        const vf = spelledToVexflow(symbol.pitch)
        const stemUp = stemUpForNote(symbol.pitch, clef)

        const note = new StaveNote({
            keys: [vf.key],
            duration: durationToVexflow(symbol.duration),
            clef,
            stemDirection: stemUp ? Stem.UP : Stem.DOWN
        })

        if (vf.accidental) {
            note.addModifier(new Accidental(vf.accidental), 0)
        } else {
            // invisible accidental to keep spacing stable
            const ghost = new Accidental("n")
            ghost.setStyle({ fillStyle: "transparent", strokeStyle: "transparent" })
            note.addModifier(ghost, 0)
        }

        return note
    })

    voice.addTickables(tickables)
    return voice
}

/**
 * Formatter helper
 */
export function formatVoiceToStave(
    voice: Voice,
    staveWidth: number
): void {
    new Formatter().joinVoices([voice]).format([voice], staveWidth)
}

/**
 * Helper: create a single VexFlow StaveNote from LengthSymbol
 */
export function lengthSymbolToStaveNote(symbol: MusicSymbol, clef: Clef): StaveNote {
    const vfDuration = durationToVexflow(symbol.duration)
    if (symbol.type === "rest") {
        return new StaveNote({
            keys: ["b/4"],
            duration: vfDuration + "r",
            clef
        })
    }

    const vf = spelledToVexflow(symbol.pitch)
    const stemUp = stemUpForNote(symbol.pitch, clef)

    const note = new StaveNote({
        keys: [vf.key],
        duration: vfDuration,
        clef,
        stemDirection: stemUp ? Stem.UP : Stem.DOWN
    })

    if (vf.accidental) {
        note.addModifier(new Accidental(vf.accidental), 0)
    } else {
        const ghost = new Accidental("n")
        ghost.setStyle({ fillStyle: "transparent", strokeStyle: "transparent" })
        note.addModifier(ghost, 0)
    }

    return note
}