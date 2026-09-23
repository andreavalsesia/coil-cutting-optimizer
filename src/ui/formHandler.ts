import { OptimizationMethod, type Piece } from "../const/customData";
import type { AppState } from "../state";

function escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Initialize events for query form
 * @param {AppState} state
 * @param {Function} onSubmitCallback Callback executed if the submission is valid
 */
export function initFormHandler(state: AppState, onSubmitCallback: (state: AppState) => void) {
    const form = document.getElementById('cutting-form') as HTMLFormElement | null;
    const btnSubmit = document.getElementById('btn-submit') as HTMLButtonElement | null;
    const inputCoil = document.getElementById('input-coil-length') as HTMLInputElement | null;
    const inputMinOffcut = document.getElementById('input-offcut-min-length') as HTMLInputElement | null;
    const selectMethod = document.getElementById('select-method') as HTMLSelectElement | null;
    const tbodyPieces = document.getElementById('pieces-table-body') as HTMLTableSectionElement | null;
    const btnAddPieceRow = document.getElementById('btn-add-piece-row') as HTMLButtonElement | null;
    const resultsContainer = document.getElementById('output-container');

    if (!form || !btnSubmit || !inputCoil || !inputMinOffcut || !selectMethod || !tbodyPieces || !btnAddPieceRow) {
        console.warn('Form o elementi essenziali del DOM non trovati.');
        return;
    }

    // 1. Popolamento del menu a tendina usando l'Enum StrategiaOttimizzazione
    selectMethod.innerHTML = `
    <option value="${OptimizationMethod.LONGEST_OFFCUT}">Scarto più lungo possibile</option>
    <option value="${OptimizationMethod.TARGET_OFFCUT}">Scarto più vicino al minimo</option>
  `;

    // 2. Sincronizzazione dei campi con i valori iniziali dello State
    inputCoil.value = state.coilLength.toString();
    inputMinOffcut.value = state.minOffcut.toString();
    selectMethod.value = state.method.toString();

    // 3. Listener per aggiornamenti parametri di base
    inputCoil.addEventListener('input', (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        state.coilLength = parseFloat(target.value) || 0;
        state.saveToLocalStorage();
    });

    inputMinOffcut.addEventListener('input', (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        state.minOffcut = parseFloat(target.value) || 0;
        state.saveToLocalStorage();
    });

    selectMethod.addEventListener('change', (e: Event) => {
        const target = e.currentTarget as HTMLSelectElement;
        state.method = target.value as OptimizationMethod;
        state.saveToLocalStorage();
    });

    // 4. Gestione della Tabella (Render + Event Delegation)
    function renderTable(): void {
        if (!tbodyPieces) return;
        tbodyPieces.innerHTML = '';

        state.PiecesTypes.forEach((row: Piece) => {
            const tr = createTableRow(row);
            tbodyPieces.appendChild(tr);
        });
    }

    // Evento per aggiungere una riga
    btnAddPieceRow.addEventListener('click', () => {
        state.addNewPieceType(100, 1);
        renderTable();
    });

    // Event Delegation per aggiornamento input nella tabella
    tbodyPieces.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement | null;
        if (!target || !target.classList.contains('input-row')) return;

        const id = parseInt(target.dataset.id || '', 10);
        const field = target.dataset.field as 'length' | 'quantity' | undefined;
        const val = parseFloat(target.value) || 0;

        if (isNaN(id) || !field) return;

        const row = state.PiecesTypes.find((r) => r.id === id);
        if (row && field in row) {
            row[field] = val;
        }

        state.saveToLocalStorage();
    });

    // Event Delegation per cancellazione riga
    tbodyPieces.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement | null;
        // Permette il click anche se l'utente clicca su un elemento figlio all'interno del bottone
        const deleteBtn = target?.closest('.btn-delete') as HTMLButtonElement | null;

        if (!deleteBtn) return;

        const id = parseInt(deleteBtn.dataset.id || '', 10);
        if (!isNaN(id)) {
            state.removePieceType(id);
            renderTable();
        }
    });

    // Invio del Form
    form.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();

        if (state.PiecesTypes.length === 0) {
            alert('Inserisci almeno un pezzo da tagliare.');
            return;
        }

        const pezziFuoriMisura = state.PiecesTypes.filter((p) => p.length > state.coilLength);
        if (pezziFuoriMisura.length > 0) {
            alert(
                `Errore: ${pezziFuoriMisura[0].name} (${pezziFuoriMisura[0].length}mm) supera la lunghezza della bobina (${state.coilLength}mm)!`
            );
            return;
        }

        const originalBtnHtml = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Calcolo in corso...</span>
        `;

        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }

        setTimeout(() => {
            onSubmitCallback(state);

            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnHtml;

            if (resultsContainer) {
                resultsContainer.classList.remove('hidden');
            }
        }, 200);
    });

    // Inizializzazione dati di esempio all'avvio
    if (state.PiecesTypes.length === 0) {
        state.addNewPieceType(230, 4);
        state.addNewPieceType(140, 3);
    }
    renderTable();
}

/**
 * Helper per la creazione HTML della singola riga di tabella.
 */
function createTableRow(row: Piece): HTMLTableRowElement {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/50 transition-colors';

    tr.innerHTML = `
        <td class="py-2 px-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-3.5 rounded-full inline-block shrink-0" style="background-color: ${row.color};"></span>
            <span class="font-medium text-slate-700">${escapeHtml(row.name)}</span>
          </div>
        </td>
        <td class="py-2 px-3">
          <input 
            type="number" 
            min="1" step="any" 
            value="${row.length}" 
            data-id="${row.id}" 
            data-field="length"
            class="input-row bg-white w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:border-neutral-400 ring-neutral-400 outline-none text-slate-800"
          >
        </td>
        <td class="py-2 px-3">
          <input 
            type="number" 
            min="1" step="1" 
            value="${row.quantity}" 
            data-id="${row.id}" 
            data-field="quantity"
            class="input-row bg-white w-24 px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:border-neutral-400 ring-neutral-400 outline-none text-slate-800"
          >
        </td>
        <td class="py-2 px-3 text-center">
          <button 
            type="button" 
            data-id="${row.id}"
            class="btn-delete text-slate-400 hover:text-red-500 font-bold p-1 rounded transition-colors"
            title="Rimuovi pezzo"
          >
            ✕
          </button>
        </td>
    `;

    return tr;
}