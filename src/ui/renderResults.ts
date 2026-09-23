import type { Piece, Result } from "../const/customData";
import type { AppState } from "../state";

export function renderResults(result: Result, state: AppState) {
  const container = document.getElementById('output-container');
  const content = document.getElementById('output-content');

  if (!content || !container) {
    console.log("No output content panel found");
    return;
  }

  if (!result || !result.coils) {
    content.innerHTML = `<p class="text-red-500">Unable to get a valid solution.</p>`;
    container.classList.remove('hidden');
    return;
  }

  const coils = result.coils;
  const coilLength = state.coilLength;
  const minOffcut = state.minOffcut;

  // Calcolo statistiche riepilogative
  let totalOffcut = 0;
  let totalWaste = 0;

  // Mappa per risalire velocemente al colore e nome del pezzo dalla sua lunghezza
  const piecesMap: Map<number, Piece> = new Map();
  state.PiecesTypes.forEach(r => {
    piecesMap.set(r.length, r);
  });

  // Generazione del markup per ogni bobina
  let htmlCoils = '';

  coils.forEach((coilPieces, idx) => {
    const usedLength = coilPieces.reduce((acc, p) => acc + p, 0);
    const offcut = coilLength - usedLength;
    const isReusable = offcut >= minOffcut;

    if (offcut >= minOffcut) {
      totalOffcut += offcut;
    } else {
      totalWaste += offcut;
    }

    // Costruzione segmenti della barra grafica (senza etichette di testo)
    let barSegments = '';
    coilPieces.forEach(p => {
      const pct = (p / coilLength) * 100;
      const info = piecesMap.get(p) || { name: `${p}mm`, color: '#3b82f6' };

      barSegments += `
        <div 
          style="width: ${pct}%; background-color: ${info.color};" 
          class="coil-segment h-full border-r border-white/20 cursor-pointer hover:brightness-110 transition-all select-none"
          data-name="${info.name}"
          data-length="${p} mm"
        ></div>
      `;
    });

    // Segmento di scarto/fondo
    if (offcut > 0) {
      const pctScarto = (offcut / coilLength) * 100;
      const coloreScarto = isReusable ? 'bg-emerald-300' : 'bg-red-300';
      const tipologiaScarto = isReusable ? 'Scarto Riutilizzabile' : 'Rifiuto Inutilizzabile';

      barSegments += `
        <div 
          style="width: ${pctScarto}%;" 
          class="coil-segment h-full ${coloreScarto} cursor-pointer hover:brightness-110 transition-all select-none"
          data-name="${tipologiaScarto}"
          data-length="${offcut.toFixed(1)} mm"
        ></div>
      `;
    }

    // Badge stato scarto
    const badgeScarto = isReusable
      ? `<span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">Scarto (${offcut.toFixed(1)} mm)</span>`
      : `<span class="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium">Rifiuto (${offcut.toFixed(1)} mm)</span>`;

    htmlCoils += `
      <div class="border border-neutral-200 rounded-lg p-4 bg-neutral-50/50 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-bold text-neutral-800">Bobina #${idx + 1}</span>
          ${badgeScarto}
        </div>

        <!-- Barra Grafica Proporzionale -->
        <div class="w-full h-10 bg-neutral-200 rounded-md overflow-hidden flex shadow-inner relative">
          ${barSegments}
        </div>

        <!-- Elenco Operatore -->
        <div class="text-sm text-neutral-600">
          <strong>Tagli da eseguire:</strong> ${(() => {
        const counts = new Map();
        for (const p of coilPieces) {
          counts.set(p, (counts.get(p) || 0) + 1);
        }

        return Array.from(counts.entries())
          .map(([length, count]) => {
            const name = piecesMap.get(length)?.name || 'Pezzo';
            const qtyPrefix = count > 1 ? `<strong>${count}x</strong> ` : '';
            return `${qtyPrefix}${length}mm (${name})`;
          })
          .join(', ');
      })()}
        </div>
      </div>
    `;
  });

  // Assemblaggio HTML Finale + Struttura del Tooltip Floater
  content.innerHTML = `
    <!-- Tooltip Floater -->
    <div 
      id="segment-tooltip" 
      class="fixed hidden z-50 pointer-events-none bg-neutral-900/90 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-neutral-700/50 -tranneutral-x-1/2 -tranneutral-y-full mb-2 transition-opacity duration-150"
    >
      <div id="tooltip-name" class="font-semibold text-neutral-200"></div>
      <div id="tooltip-length" class="text-neutral-400 font-bold"></div>
    </div>

    <!-- Dashboard Riepilogo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-neutral-100 p-4 rounded-lg text-center">
        <div class="text-xs uppercase font-semibold text-neutral-700 mb-1">Bobine Totali</div>
        <div class="text-2xl font-extrabold text-neutral-900">${coils.length}</div>
      </div>
      <div class="bg-emerald-50 p-4 rounded-lg text-center">
        <div class="text-xs uppercase font-semibold text-emerald-600 mb-1">Scarto Riutilizzabile Totale</div>
        <div class="text-2xl font-extrabold text-emerald-900">${totalOffcut.toFixed(1)} <span class="text-sm font-normal">mm</span></div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg text-center">
        <div class="text-xs uppercase font-semibold text-red-600 mb-1">Rifiuto Inutilizzabile</div>
        <div class="text-2xl font-extrabold text-red-900">${totalWaste.toFixed(1)} <span class="text-sm font-normal">mm</span></div>
      </div>
    </div>

    <!-- Lista Bobine -->
    <div class="space-y-4">
      ${htmlCoils}
    </div>
  `;

  // Inizializzazione della logica del Tooltip Floater
  setupTooltipHandler();

  container.classList.remove('hidden');
}

/**
 * Gestisce l'interazione del Tooltip Floater (Hover per desktop, Click/Touch per mobile)
 */
function setupTooltipHandler() {
  const tooltip = document.getElementById('segment-tooltip');
  const tooltipName = document.getElementById('tooltip-tooltip-name') || document.getElementById('tooltip-name');
  const tooltipLength = document.getElementById('tooltip-length');

  if (!tooltip || !tooltipName || !tooltipLength) return;

  const showTooltip = (target: HTMLElement, clientX: number, clientY: number) => {
    const name = target.dataset.name || '';
    const length = target.dataset.length || '';

    tooltipName.textContent = name;
    tooltipLength.textContent = length;

    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY - 8}px`; // Un piccolo offset verticale sopra il cursore/dito
    tooltip.classList.remove('hidden');
  };

  const hideTooltip = () => {
    tooltip.classList.add('hidden');
  };

  // Delegazione eventi su tutto il documento o contenitore
  document.addEventListener('mousemove', (e) => {
    const target = (e.target as HTMLElement).closest('.coil-segment') as HTMLElement;
    if (target) {
      showTooltip(target, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  });

  // Gestione per Touch / Click (Mobile)
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.coil-segment') as HTMLElement;
    if (target) {
      showTooltip(target, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  });
}