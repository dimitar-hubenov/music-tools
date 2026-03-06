// src/components/Staff.tsx

import { useEffect, useRef } from "react"

import {
    type Clef,
    stemUpForNote
} from "../lib/music"

import type { MusicSymbol } from "../lib/music/symbol"

import {
    spelledToVexflow,
    durationToVexflow,
    
} from "../lib/music/vexflow"

import {
    Renderer,
    Stave,
    StaveNote,
    Accidental,
    Voice,
    Formatter,
    Stem
} from "vexflow"

interface StaffProps {
    clef: Clef
    target: MusicSymbol
}

export default function Staff({
    clef,
    target
}: StaffProps) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (!containerRef.current) return

        containerRef.current.innerHTML = ""

        const renderer = new Renderer(
            containerRef.current,
            Renderer.Backends.SVG
        )

        renderer.resize(200, 160)

        const context = renderer.getContext()

        const stave = new Stave(10, 20, 180)
        stave.addClef(clef)
        stave.setContext(context).draw()

        const duration = durationToVexflow(target.duration)

        let staveNote: StaveNote

        if (target.type === "rest") {

            staveNote = new StaveNote({
                clef,
                keys: ["b/4"],     // standard rest placement
                duration: duration + "r"
            })

        } else {

            const spelled = target.pitch

            const vf = spelledToVexflow(spelled)

            const stemUp = stemUpForNote(spelled, clef)

            staveNote = new StaveNote({
                clef,
                keys: [vf.key],
                duration,
                stemDirection: stemUp ? Stem.UP : Stem.DOWN
            })

            if (vf.accidental) {

                staveNote.addModifier(
                    new Accidental(vf.accidental),
                    0
                )

            } else {

                // invisible accidental to stabilize spacing
                const ghost = new Accidental("n")

                ghost.setStyle({
                    fillStyle: "transparent",
                    strokeStyle: "transparent"
                })

                staveNote.addModifier(ghost, 0)
            }
        }

        const voice = new Voice({
            numBeats: 4,
            beatValue: 4
        }).setStrict(false)

        voice.addTickables([staveNote])

        new Formatter()
            .joinVoices([voice])
            .format([voice], 140)

        voice.draw(context, stave)

    }, [clef, target])

    return <div ref={containerRef} />
}