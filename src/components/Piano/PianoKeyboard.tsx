// src/components/Piano/PianoKeyboard.tsx

import clsx from "clsx"
import { getNoteName, type NamingSystem } from "../../lib/music"

interface Props {
    lowMidi?: number
    highMidi?: number
    onPress?: (midi: number) => void
    onNote?: (midi: number) => void
    highlighted?: number[]       // correct / target keys
    wrong?: number[]             // wrong keys
    disabled?: number[]
    naming?: NamingSystem
}

const WHITE_WIDTH = 48

function isBlack(midi: number) {
    const pc = ((midi % 12) + 12) % 12
    return [1, 3, 6, 8, 10].includes(pc)
}

export default function PianoKeyboard({
    lowMidi = 60,
    highMidi = 72,
    onPress,
    onNote,
    highlighted = [],
    wrong = [],
    disabled = [],
    naming = "lat",
}: Props) {
    const keys: number[] = []

    for (let m = lowMidi; m <= highMidi; m++) {
        keys.push(m)
    }

    const whites = keys.filter(k => !isBlack(k))
    const blacks = keys.filter(k => isBlack(k))

    return (
        <div className="relative h-40 select-none">
            {/* WHITE KEYS */}
            <div className="flex">
                {whites.map((midi) => (
                    <WhiteKey
                        key={midi}
                        midi={midi}
                        onPress={onPress}
                        onNote={onNote}
                        active={highlighted.includes(midi)}
                        wrong={wrong.includes(midi)}
                        disabled={disabled.includes(midi)}
                        naming={naming}
                    />
                ))}
            </div>

            {/* BLACK KEYS */}
            <div className="absolute top-0 left-0 h-full pointer-events-none">
                {blacks.map((midi) => {
                    const whiteIndex =
                        keys.filter(k => !isBlack(k) && k < midi).length - 1

                    const left = (whiteIndex + 1) * WHITE_WIDTH - 16

                    return (
                        <BlackKey
                            key={midi}
                            midi={midi}
                            left={left}
                            onPress={onPress}
                            onNote={onNote}
                            active={highlighted.includes(midi)}
                            wrong={wrong.includes(midi)}
                            disabled={disabled.includes(midi)}
                        />
                    )
                })}
            </div>
        </div>
    )
}

interface KeyProps {
    midi: number
    onPress?: (midi: number) => void
    onNote?: (midi: number) => void
    active?: boolean
    wrong?: boolean
    disabled?: boolean
    naming?: NamingSystem
}

function WhiteKey({
    midi,
    onPress,
    onNote,
    active,
    wrong,
    disabled,
    naming,
}: KeyProps) {
    return (
        <button
            disabled={disabled}
            onMouseDown={() => onPress?.(midi)}
            onClick={() => onNote?.(midi)}
            className={clsx(
                "relative w-12 h-40 border border-zinc-400 rounded-b-md",
                "transition-all duration-75 ease-out",
                "shadow-[0_4px_0_rgb(161,161,170)]",
                "active:shadow-[0_1px_0_rgb(161,161,170)]",
                "active:translate-y-[3px]",
                disabled && "opacity-40",

                wrong ? "bg-red-400" :
                    active ? "bg-green-400" :
                        "bg-gradient-to-b from-white to-gray-200"
            )}
        >
            {naming && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-zinc-700 pointer-events-none">
                    {getNoteName(midi, naming)}
                </span>
            )}
        </button>
    )
}

interface BlackKeyProps extends KeyProps {
    left: number
}

function BlackKey({
    midi,
    left,
    onPress,
    onNote,
    active,
    wrong,
    disabled,
}: BlackKeyProps) {
    return (
        <button
            disabled={disabled}
            onMouseDown={() => onPress?.(midi)}
            onClick={() => onNote?.(midi)}
            className={clsx(
                "absolute pointer-events-auto",
                "w-8 h-24 rounded-b-md",
                "transition-all duration-75 ease-out",
                "shadow-[0_3px_0_rgb(24,24,27)]",
                "active:shadow-[0_1px_0_rgb(24,24,27)]",
                "active:translate-y-[2px]",
                disabled && "opacity-40",
                
                wrong ? "bg-red-400 animate-shake" :
                    active ? "bg-green-400" :
                        "bg-gradient-to-b from-zinc-800 to-black"
            )}
            style={{ left }}
        />
    )
}