export function generatePieceName(index: number): string {
    let name: string = '';
    let i: number = index;
    while (i >= 0) {
        name = String.fromCharCode((i % 26) + 65) + name;
        i = Math.floor(i / 26) - 1;
    }
    return `${name}`;
}