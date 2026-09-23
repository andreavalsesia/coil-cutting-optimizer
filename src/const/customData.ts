/**
 * Optimization methods
 * @enum {string}
 */
export const OptimizationMethod = Object.freeze({
    LONGEST_OFFCUT: 'LONGEST_OFFCUT',
    TARGET_OFFCUT: 'TARGET_OFFCUT'
} as const);

export type OptimizationMethod = typeof OptimizationMethod[keyof typeof OptimizationMethod];

export const COLOR_PALETTE = [
    '#2563eb', '#7c3aed', '#db2777', '#ea580c',
    '#16a34a', '#0891b2', '#4f46e5', '#ca8a04'
];

export type Piece = {
    id: number,
    name: string,
    color: string,
    length: number,
    quantity: number
};

export type Result = {
    coils: number[][],
    penalty: number
}