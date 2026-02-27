export function randomMidi(
    low: number,
    high: number
) {
    return Math.floor(
        Math.random() * (high - low + 1)
    ) + low
}
