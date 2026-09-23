import { OptimizationMethod } from "../const/customData";

/**
 * Calcola la penalità per uno scarto residuo.
 * @param offcut Lo scarto rimanente in una bobina (in cm)
 * @param minOffcut Lunghezza del pezzo TARGET (o modulo minimo)
 * @param method Metodo di ottimizzazione
 */
function calculateOffcutPenalty(offcut: number, targetLength: number, method: OptimizationMethod): number {
    // Tolleranza per arrotondamenti floating point
    if (offcut < 0.01) {
        return 0;
    }

    // SE LO SCARTO È MINORE DEL PEZZO TARGET: è scarto puro (rifiuto)
    if (offcut < targetLength) {
        return offcut * 10000; // Forte penalità per rifiuto inutilizzabile
    }

    if (method === OptimizationMethod.TARGET_OFFCUT) {
        // Calcoliamo quanto questo spezzone differisce da un MULTIPLO ESATTO del pezzo target
        const remainder = offcut % targetLength;

        // Tolleranza imperfezione (es. entro 0.1 cm è considerato un multiplo perfetto)
        const isExactMultiple = remainder < 0.1 || (targetLength - remainder) < 0.1;

        if (isExactMultiple) {
            // Premio enorme se lo spezzone avanzato è un multiplo esatto di targetLength!
            // Più è lungo lo spezzone riutilizzabile, più è alto il bonus.
            return - (offcut * 50);
        }

        // Se non è un multiplo esatto, la penalità è proporzionale al "resto inutilizzabile"
        const wastePart = Math.min(remainder, targetLength - remainder);
        return (wastePart * 5000) + (offcut * 2);
    }

    if (method === OptimizationMethod.LONGEST_OFFCUT) {
        // Favorisce semplicemente gli spezzoni rimanenti più lunghi possibili
        return -offcut;
    }

    return 0;
}

export function calculateTotalPenalty(coils: number[][], coilLength: number, targetLength: number, method: OptimizationMethod): number {
    // Minimizzare il numero di bobine aperte ha sempre priorità massima
    let penalty = coils.length * 1000000;

    for (const pieces of coils) {
        const usedLength = pieces.reduce((sum, p) => sum + p, 0);
        const offcut = coilLength - usedLength;

        penalty += calculateOffcutPenalty(offcut, targetLength, method);
    }

    return penalty;
}