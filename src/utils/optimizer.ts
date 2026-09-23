import { OptimizationMethod, type Result } from "../const/customData";
import { calculateTotalPenalty } from "./penaltyEvaluator";

export function optimizeCut(
    pieces: number[],
    coilLength: number,
    minOffcut: number, // Usato come targetLength
    method: OptimizationMethod
): Result {
    if (pieces.length === 0) {
        return { coils: [], penalty: 0 };
    }

    // 1. Ordina i pezzi dal più lungo al più corto (Greedy Strategy)
    const sortedPieces = [...pieces].sort((a, b) => b - a);
    const coils: number[][] = [];

    // 2. Assegna ciascun pezzo scegliendo la bobina che minimizza la penalità parziale
    for (const piece of sortedPieces) {
        let bestCoilIndex = -1;
        let bestAddedPenalty = Infinity;

        // Prova a inserire il pezzo in ciascuna delle bobine esistenti
        for (let i = 0; i < coils.length; i++) {
            const currentUsed = coils[i].reduce((sum, p) => sum + p, 0);

            // Verifica se il pezzo ci sta nella bobina
            if (currentUsed + piece <= coilLength) {
                // Calcola lo scarto potenziale con e senza il nuovo pezzo
                const oldOffcut = coilLength - currentUsed;
                const newOffcut = coilLength - (currentUsed + piece);

                // Valuta il punteggio dell'impatto di questa scelta
                const scoreDiff = evaluatePlacementScore(newOffcut, oldOffcut, minOffcut, method);

                if (scoreDiff < bestAddedPenalty) {
                    bestAddedPenalty = scoreDiff;
                    bestCoilIndex = i;
                }
            }
        }

        // Se è stato trovato un posto valido tra le bobine esistenti, inseriscilo lì
        if (bestCoilIndex !== -1) {
            coils[bestCoilIndex].push(piece);
        } else {
            // Altrimenti apri una nuova bobina
            coils.push([piece]);
        }
    }

    // 3. Calcola la penalità complessiva finale del risultato
    const finalPenalty = calculateTotalPenalty(coils, coilLength, minOffcut, method);

    return {
        coils,
        penalty: finalPenalty
    };
}

/**
 * Funzione ausiliaria per valutare la convenienza di inserire un pezzo in una specifica bobina.
 */
function evaluatePlacementScore(
    newOffcut: number,
    oldOffcut: number,
    targetLength: number,
    method: OptimizationMethod
): number {
    if (method === OptimizationMethod.TARGET_OFFCUT) {
        const newRemainder = newOffcut % targetLength;
        // Premia le configurazioni che lasciano uno scarto finale che è un multiplo di targetLength
        const isMultiple = newRemainder < 0.1 || (targetLength - newRemainder) < 0.1;

        if (isMultiple && newOffcut >= targetLength) {
            return -1000; // Forte incentivo a creare multipli esatti
        }

        return newRemainder;
    }

    // Per LONGEST_OFFCUT o standard, preferisci minimizzare il residuo immediato
    return newOffcut;
}