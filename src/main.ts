import type { Result } from './const/customData.js';
import { AppState } from './state.js';
import { initFormHandler } from './ui/formHandler.js';
import { renderResults } from './ui/renderResults.js';
import { optimizeCut } from './utils/optimizer.js';

function bootstrap() {
    console.log('Platform Initialized');

    const appState = AppState.loadFromLocalStorage();

    initFormHandler(appState, (state: AppState) => {
        const piecesFlatArray = state.getPiecesAsFlatArray();

        const result: Result = optimizeCut(piecesFlatArray, state.coilLength, state.minOffcut, state.method);

        renderResults(result, state);
    });
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', bootstrap);