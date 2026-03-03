// src/components/PianoStaff.tsx

import { useEffect, useRef } from "react"
import {
    Renderer,
    Stave,
    StaveNote,
    Accidental,
    Voice,
    Formatter,
    StaveConnector
} from "vexflow"

interface PianoStaffProps {
    trebleNote?: string   // "c/5"
    trebleAccidental?: string
    bassNote?: string     // "c/3"
    bassAccidental?: string
}

export default function PianoStaff({
    trebleNote,
    trebleAccidental,
    bassNote,
    bassAccidental,
}: PianoStaffProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        containerRef.current.innerHTML = ""

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
        renderer.resize(220, 220)
        const context = renderer.getContext()

        const trebleStave = new Stave(20, 20, 160)
        const bassStave = new Stave(20, 110, 160)

        trebleStave.addClef("treble")
        bassStave.addClef("bass")

        trebleStave.setContext(context).draw()
        bassStave.setContext(context).draw()

        const brace = new StaveConnector(trebleStave, bassStave)
        brace.setType(StaveConnector.type.BRACE)
        brace.setContext(context).draw()

        const leftLine = new StaveConnector(trebleStave, bassStave)
        leftLine.setType(StaveConnector.type.SINGLE_LEFT)
        leftLine.setContext(context).draw()

        const rightLine = new StaveConnector(trebleStave, bassStave)
        rightLine.setType(StaveConnector.type.SINGLE_RIGHT)
        rightLine.setContext(context).draw()

        const voices: Voice[] = []

        let trebleVoice: Voice | null = null
        let bassVoice: Voice | null = null

        // 🎵 Treble
        if (trebleNote) {
            const note = new StaveNote({
                keys: [trebleNote],
                duration: "w",
                clef: "treble"
            })

            if (trebleAccidental) {
                note.addModifier(new Accidental(trebleAccidental), 0)
            } else {
                // Add invisible accidental to reserve spacing
                const ghost = new Accidental("n") // natural
                ghost.setStyle({ fillStyle: "transparent", strokeStyle: "transparent" })
                note.addModifier(ghost, 0)
            }

            trebleVoice = new Voice({ numBeats: 4, beatValue: 4 })
            trebleVoice.addTickables([note])
            voices.push(trebleVoice)
        }

        // 🎵 Bass
        if (bassNote) {
            const note = new StaveNote({
                keys: [bassNote],
                duration: "w",
                clef: "bass"
            })

            if (bassAccidental) {
                note.addModifier(new Accidental(bassAccidental), 0)
            } else {
                // Add invisible accidental to reserve spacing
                const ghost = new Accidental("n") // natural
                ghost.setStyle({ fillStyle: "transparent", strokeStyle: "transparent" })
                note.addModifier(ghost, 0)
            }

            bassVoice = new Voice({ numBeats: 4, beatValue: 4 })
            bassVoice.addTickables([note])
            voices.push(bassVoice)
        }

        // ✅ FORMAT FIRST
        if (voices.length > 0) {
            new Formatter()
                .joinVoices(voices)
                .format(voices, 120)
        }

        // ✅ THEN DRAW
        trebleVoice?.draw(context, trebleStave)
        bassVoice?.draw(context, bassStave)

    }, [trebleNote, trebleAccidental, bassNote, bassAccidental])

    return <div ref={containerRef} />
}
