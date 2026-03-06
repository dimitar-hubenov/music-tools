// src/components/PianoStaff.tsx

import { useEffect, useRef } from "react"
import {
    Renderer,
    Stave,
    StaveNote,
    Voice,
    Formatter,
    Accidental,
    Stem,
    StaveConnector
} from "vexflow"

import { type MusicSymbol, stemUpForNote } from "../lib/music"
import {
    spelledToVexflow,
    durationToVexflow,
} from "../lib/music/vexflow"

export default function PianoStaff({
    target
}: {
    target: MusicSymbol
}) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (!containerRef.current) return

        containerRef.current.innerHTML = ""

        const renderer = new Renderer(
            containerRef.current,
            Renderer.Backends.SVG
        )

        renderer.resize(220, 220)

        const context = renderer.getContext()

        const treble = new Stave(20, 20, 160)
        treble.addClef("treble")
        treble.setContext(context).draw()

        const bass = new Stave(20, 110, 160)
        bass.addClef("bass")
        bass.setContext(context).draw()

        const brace = new StaveConnector(treble, bass)
        brace.setType(StaveConnector.type.BRACE)
        brace.setContext(context).draw()

        const leftLine = new StaveConnector(treble, bass)
        leftLine.setType(StaveConnector.type.SINGLE_LEFT)
        leftLine.setContext(context).draw()

        const rightLine = new StaveConnector(treble, bass)
        rightLine.setType(StaveConnector.type.SINGLE_RIGHT)
        rightLine.setContext(context).draw()

        if (target.type !== "note") return

        const vf = spelledToVexflow(target.pitch)
        const duration = durationToVexflow(target.duration)

        const midi = target.pitch.midi

        const clef = midi >= 60 ? "treble" : "bass"

        const stemUp = stemUpForNote(target.pitch, clef)

        const staveNote = new StaveNote({
            clef,
            keys: [vf.key],
            duration,
            stemDirection: stemUp ? Stem.UP : Stem.DOWN
        })

        if (vf.accidental) {
            staveNote.addModifier(new Accidental(vf.accidental), 0)
        } else {
            const ghost = new Accidental("n")
            ghost.setStyle({
                fillStyle: "transparent",
                strokeStyle: "transparent"
            })
            staveNote.addModifier(ghost, 0)
        }

        const voice = new Voice({
            numBeats: 4,
            beatValue: 4
        }).setStrict(false)

        voice.addTickables([staveNote])

        new Formatter()
            .joinVoices([voice])
            .format([voice], 200)

        if (clef === "treble") {
            voice.draw(context, treble)
        } else {
            voice.draw(context, bass)
        }

    }, [target])

    return <div ref={containerRef} />
}