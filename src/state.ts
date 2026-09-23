import { COLOR_PALETTE, OptimizationMethod, type Piece } from "./const/customData";
import { generatePieceName } from "./utils/generatePieceName";

const STORAGE_KEY = 'coil_optimizer_app_state';

export class AppState {
    coilLength: number;
    minOffcut: number;
    method: OptimizationMethod;
    PiecesTypes: Piece[];
    nextId: number;

    constructor() {
        this.coilLength = 1000;
        this.minOffcut = 200;
        this.method = OptimizationMethod.TARGET_OFFCUT;
        this.PiecesTypes = [];
        this.nextId = 1;
    }

    addNewPieceType(length = 100, quantity = 1): Piece {
        const index = this.PiecesTypes.length;
        const newPiece: Piece = {
            id: this.nextId++,
            name: generatePieceName(index),
            color: COLOR_PALETTE[index % COLOR_PALETTE.length],
            length: Number(length),
            quantity: Number(quantity)
        };
        this.PiecesTypes.push(newPiece);
        this.saveToLocalStorage();
        return newPiece;
    }

    removePieceType(id: number) {
        this.PiecesTypes = this.PiecesTypes.filter(row => row.id !== id);
        // Recalculate names to maintain letter order
        this.PiecesTypes.forEach((row, idx) => {
            row.name = generatePieceName(idx);
            row.color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
        });
        this.saveToLocalStorage();
    }

    getPiecesAsFlatArray(): number[] {
        const flatArray: number[] = [];
        for (const row of this.PiecesTypes) {
            for (let i = 0; i < row.quantity; i++) {
                flatArray.push(row.length);
            }
        }
        return flatArray;
    }

    /**
     * Salva lo stato corrente dell'istanza in localStorage
     */
    saveToLocalStorage(): void {
        const dataToSave = {
            coilLength: this.coilLength,
            minOffcut: this.minOffcut,
            method: this.method,
            PiecesTypes: this.PiecesTypes,
            nextId: this.nextId
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }

    /**
     * Carica lo stato da localStorage oppure restituisce una nuova istanza con i valori di default
     */
    static loadFromLocalStorage(): AppState {
        const state = new AppState();
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state.coilLength = Number(parsed.coilLength) || 1000;
                state.minOffcut = Number(parsed.minOffcut) || 200;
                state.method = parsed.method || OptimizationMethod.TARGET_OFFCUT;
                state.PiecesTypes = Array.isArray(parsed.PiecesTypes) ? parsed.PiecesTypes : [];
                state.nextId = Number(parsed.nextId) || (state.PiecesTypes.length + 1);
            } catch (e) {
                console.error("Errore nel ripristino dello stato da localStorage:", e);
            }
        }

        return state;
    }

    /**
     * Ripristina i valori di default e pulisce lo storage
     */
    resetState(): void {
        this.coilLength = 1000;
        this.minOffcut = 200;
        this.method = OptimizationMethod.TARGET_OFFCUT;
        this.PiecesTypes = [];
        this.nextId = 1;
        localStorage.removeItem(STORAGE_KEY);
    }
}