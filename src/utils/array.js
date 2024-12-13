export function difference(a, b) {
    const setB = new Set(b);
    return a.filter(el => !setB.has(el));
}

export function shuffled(els) {
    const shuffled = [...els];
    for (let i = els.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
    
export function takeRandom(els) {
    return els[Math.floor(Math.random() * els.length)];
}
