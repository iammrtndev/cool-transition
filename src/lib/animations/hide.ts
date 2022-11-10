export function hide(node, {
    delay = 2000,
    duration = 2000
}) {
    const o = +getComputedStyle(node).opacity;

    return {
        delay,
        duration,
        css: (t) => `
            display: ${t < 0.9 ? 'hidden' : 'block'};
            opacity: ${t * o};
            transform: translateY(${100-t*100}vh);
            ${console.log(t)}
        `
    };
}