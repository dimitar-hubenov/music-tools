// src/lib/music/naming.ts

import {  
    PITCH_CLASS_SPELLINGS, 
    getNaturalIndex,
    normalizePitchClass
} from "./theory"

export const NAMING_SYSTEMS = [
    "lat",
    "cyr",
    "solfege"
] as const

export type NamingSystem = typeof NAMING_SYSTEMS[number]

const DefaultNamingSystem: NamingSystem = "lat"

type DiatonicNames = Record<NamingSystem, readonly string[]>

const NAME_MAP: DiatonicNames = {
    lat: ["C", "D", "E", "F", "G", "A", "B"],
    cyr: ["До", "Ре", "Ми", "Фа", "Сол", "Ла", "Си"],
    solfege: ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti"],
}

export function parseNamingSystem(
    value: string | null | undefined
): NamingSystem {
    if (!value) return DefaultNamingSystem

    if ((NAMING_SYSTEMS as readonly string[]).includes(value)) {
        return value as NamingSystem
    }

    return DefaultNamingSystem
}

export function getNoteName(
    midi: number,
    system: NamingSystem
): string {

    const pc = normalizePitchClass(midi)
    const primary = PITCH_CLASS_SPELLINGS[pc][0]

    const naturalIndex = getNaturalIndex(primary.natural)

    return NAME_MAP[system][naturalIndex]
}
