// src/components/Staff.tsx

import { useEffect, useRef } from "react"
import { Renderer, Stave, StaveNote, Accidental, Voice, Formatter } from "vexflow"

interface StaffProps {
    clef: string
    note?: string // vexflow format: "c/4"
    accidental?: string
}

export default function Staff({
    clef,
    note,
    accidental,
}: StaffProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        containerRef.current.innerHTML = ""

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
        renderer.resize(160, 160);
        const context = renderer.getContext();

        const stave = new Stave(10, 20, 120);
        stave.addClef(clef);
        stave.setContext(context).draw();

        if (!note) return

        const staveNote = new StaveNote({
            keys: [note],
            duration: "w",
            clef: clef
        })

        if (accidental) {
            staveNote.addModifier(new Accidental(accidental), 0); // applies to note at index 0
        } else {
            // Add invisible accidental to reserve spacing
            const ghost = new Accidental("n") // natural
            ghost.setStyle({ fillStyle: "transparent", strokeStyle: "transparent" })
            staveNote.addModifier(ghost, 0)
        }

        const voice = new Voice({ numBeats: 4, beatValue: 4 });
        voice.addTickables([staveNote]);

        new Formatter().joinVoices([voice]).formatToStave([voice], stave);

        voice.draw(context, stave);
    }, [clef, note, accidental])

    return <div ref={containerRef} />
}
