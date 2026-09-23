(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Object.freeze({LONGEST_OFFCUT:`LONGEST_OFFCUT`,TARGET_OFFCUT:`TARGET_OFFCUT`}),t=[`#2563eb`,`#7c3aed`,`#db2777`,`#ea580c`,`#16a34a`,`#0891b2`,`#4f46e5`,`#ca8a04`];function n(e){let t=``,n=e;for(;n>=0;)t=String.fromCharCode(n%26+65)+t,n=Math.floor(n/26)-1;return`${t}`}var r=`coil_optimizer_app_state`,i=class i{coilLength;minOffcut;method;PiecesTypes;nextId;constructor(){this.coilLength=1e3,this.minOffcut=200,this.method=e.TARGET_OFFCUT,this.PiecesTypes=[],this.nextId=1}addNewPieceType(e=100,r=1){let i=this.PiecesTypes.length,a={id:this.nextId++,name:n(i),color:t[i%t.length],length:Number(e),quantity:Number(r)};return this.PiecesTypes.push(a),this.saveToLocalStorage(),a}removePieceType(e){this.PiecesTypes=this.PiecesTypes.filter(t=>t.id!==e),this.PiecesTypes.forEach((e,r)=>{e.name=n(r),e.color=t[r%t.length]}),this.saveToLocalStorage()}getPiecesAsFlatArray(){let e=[];for(let t of this.PiecesTypes)for(let n=0;n<t.quantity;n++)e.push(t.length);return e}saveToLocalStorage(){let e={coilLength:this.coilLength,minOffcut:this.minOffcut,method:this.method,PiecesTypes:this.PiecesTypes,nextId:this.nextId};localStorage.setItem(r,JSON.stringify(e))}static loadFromLocalStorage(){let t=new i,n=localStorage.getItem(r);if(n)try{let r=JSON.parse(n);t.coilLength=Number(r.coilLength)||1e3,t.minOffcut=Number(r.minOffcut)||200,t.method=r.method||e.TARGET_OFFCUT,t.PiecesTypes=Array.isArray(r.PiecesTypes)?r.PiecesTypes:[],t.nextId=Number(r.nextId)||t.PiecesTypes.length+1}catch(e){console.error(`Errore nel ripristino dello stato da localStorage:`,e)}return t}resetState(){this.coilLength=1e3,this.minOffcut=200,this.method=e.TARGET_OFFCUT,this.PiecesTypes=[],this.nextId=1,localStorage.removeItem(r)}};function a(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function o(t,n){let r=document.getElementById(`cutting-form`),i=document.getElementById(`btn-submit`),a=document.getElementById(`input-coil-length`),o=document.getElementById(`input-offcut-min-length`),c=document.getElementById(`select-method`),l=document.getElementById(`pieces-table-body`),u=document.getElementById(`btn-add-piece-row`),d=document.getElementById(`output-container`);if(!r||!i||!a||!o||!c||!l||!u){console.warn(`Form o elementi essenziali del DOM non trovati.`);return}c.innerHTML=`
    <option value="${e.LONGEST_OFFCUT}">Scarto più lungo possibile</option>
    <option value="${e.TARGET_OFFCUT}">Scarto più vicino al minimo</option>
  `,a.value=t.coilLength.toString(),o.value=t.minOffcut.toString(),c.value=t.method.toString(),a.addEventListener(`input`,e=>{let n=e.currentTarget;t.coilLength=parseFloat(n.value)||0,t.saveToLocalStorage()}),o.addEventListener(`input`,e=>{let n=e.currentTarget;t.minOffcut=parseFloat(n.value)||0,t.saveToLocalStorage()}),c.addEventListener(`change`,e=>{t.method=e.currentTarget.value,t.saveToLocalStorage()});function f(){l&&(l.innerHTML=``,t.PiecesTypes.forEach(e=>{let t=s(e);l.appendChild(t)}))}u.addEventListener(`click`,()=>{t.addNewPieceType(100,1),f()}),l.addEventListener(`input`,e=>{let n=e.target;if(!n||!n.classList.contains(`input-row`))return;let r=parseInt(n.dataset.id||``,10),i=n.dataset.field,a=parseFloat(n.value)||0;if(isNaN(r)||!i)return;let o=t.PiecesTypes.find(e=>e.id===r);o&&i in o&&(o[i]=a),t.saveToLocalStorage()}),l.addEventListener(`click`,e=>{let n=e.target?.closest(`.btn-delete`);if(!n)return;let r=parseInt(n.dataset.id||``,10);isNaN(r)||(t.removePieceType(r),f())}),r.addEventListener(`submit`,e=>{if(e.preventDefault(),t.PiecesTypes.length===0){alert(`Inserisci almeno un pezzo da tagliare.`);return}let r=t.PiecesTypes.filter(e=>e.length>t.coilLength);if(r.length>0){alert(`Errore: ${r[0].name} (${r[0].length}mm) supera la lunghezza della bobina (${t.coilLength}mm)!`);return}let a=i.innerHTML;i.disabled=!0,i.innerHTML=`
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Calcolo in corso...</span>
        `,d&&d.classList.add(`hidden`),setTimeout(()=>{n(t),i.disabled=!1,i.innerHTML=a,d&&d.classList.remove(`hidden`)},200)}),t.PiecesTypes.length===0&&(t.addNewPieceType(230,4),t.addNewPieceType(140,3)),f()}function s(e){let t=document.createElement(`tr`);return t.className=`hover:bg-slate-50/50 transition-colors`,t.innerHTML=`
        <td class="py-2 px-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-3.5 rounded-full inline-block shrink-0" style="background-color: ${e.color};"></span>
            <span class="font-medium text-slate-700">${a(e.name)}</span>
          </div>
        </td>
        <td class="py-2 px-3">
          <input 
            type="number" 
            min="1" step="any" 
            value="${e.length}" 
            data-id="${e.id}" 
            data-field="length"
            class="input-row bg-white w-full px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:border-neutral-400 ring-neutral-400 outline-none text-slate-800"
          >
        </td>
        <td class="py-2 px-3">
          <input 
            type="number" 
            min="1" step="1" 
            value="${e.quantity}" 
            data-id="${e.id}" 
            data-field="quantity"
            class="input-row bg-white w-24 px-2.5 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:border-neutral-400 ring-neutral-400 outline-none text-slate-800"
          >
        </td>
        <td class="py-2 px-3 text-center">
          <button 
            type="button" 
            data-id="${e.id}"
            class="btn-delete text-slate-400 hover:text-red-500 font-bold p-1 rounded transition-colors"
            title="Rimuovi pezzo"
          >
            ✕
          </button>
        </td>
    `,t}function c(e,t){let n=document.getElementById(`output-container`),r=document.getElementById(`output-content`);if(!r||!n){console.log(`No output content panel found`);return}if(!e||!e.coils){r.innerHTML=`<p class="text-red-500">Unable to get a valid solution.</p>`,n.classList.remove(`hidden`);return}let i=e.coils,a=t.coilLength,o=t.minOffcut,s=0,c=0,u=new Map;t.PiecesTypes.forEach(e=>{u.set(e.length,e)});let d=``;i.forEach((e,t)=>{let n=e.reduce((e,t)=>e+t,0),r=a-n,i=r>=o;r>=o?s+=r:c+=r;let l=``;if(e.forEach(e=>{let t=e/a*100,n=u.get(e)||{name:`${e}mm`,color:`#3b82f6`};l+=`
        <div 
          style="width: ${t}%; background-color: ${n.color};" 
          class="coil-segment h-full border-r border-white/20 cursor-pointer hover:brightness-110 transition-all select-none"
          data-name="${n.name}"
          data-length="${e} mm"
        ></div>
      `}),r>0){let e=r/a*100;l+=`
        <div 
          style="width: ${e}%;" 
          class="coil-segment h-full ${i?`bg-emerald-300`:`bg-red-300`} cursor-pointer hover:brightness-110 transition-all select-none"
          data-name="${i?`Scarto Riutilizzabile`:`Rifiuto Inutilizzabile`}"
          data-length="${r.toFixed(1)} mm"
        ></div>
      `}let f=i?`<span class="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">Scarto (${r.toFixed(1)} mm)</span>`:`<span class="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium">Rifiuto (${r.toFixed(1)} mm)</span>`;d+=`
      <div class="border border-neutral-200 rounded-lg p-4 bg-neutral-50/50 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-bold text-neutral-800">Bobina #${t+1}</span>
          ${f}
        </div>

        <!-- Barra Grafica Proporzionale -->
        <div class="w-full h-10 bg-neutral-200 rounded-md overflow-hidden flex shadow-inner relative">
          ${l}
        </div>

        <!-- Elenco Operatore -->
        <div class="text-sm text-neutral-600">
          <strong>Tagli da eseguire:</strong> ${(()=>{let t=new Map;for(let n of e)t.set(n,(t.get(n)||0)+1);return Array.from(t.entries()).map(([e,t])=>{let n=u.get(e)?.name||`Pezzo`;return`${t>1?`<strong>${t}x</strong> `:``}${e}mm (${n})`}).join(`, `)})()}
        </div>
      </div>
    `}),r.innerHTML=`
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
        <div class="text-2xl font-extrabold text-neutral-900">${i.length}</div>
      </div>
      <div class="bg-emerald-50 p-4 rounded-lg text-center">
        <div class="text-xs uppercase font-semibold text-emerald-600 mb-1">Scarto Riutilizzabile Totale</div>
        <div class="text-2xl font-extrabold text-emerald-900">${s.toFixed(1)} <span class="text-sm font-normal">mm</span></div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg text-center">
        <div class="text-xs uppercase font-semibold text-red-600 mb-1">Rifiuto Inutilizzabile</div>
        <div class="text-2xl font-extrabold text-red-900">${c.toFixed(1)} <span class="text-sm font-normal">mm</span></div>
      </div>
    </div>

    <!-- Lista Bobine -->
    <div class="space-y-4">
      ${d}
    </div>
  `,l(),n.classList.remove(`hidden`)}function l(){let e=document.getElementById(`segment-tooltip`),t=document.getElementById(`tooltip-tooltip-name`)||document.getElementById(`tooltip-name`),n=document.getElementById(`tooltip-length`);if(!e||!t||!n)return;let r=(r,i,a)=>{let o=r.dataset.name||``,s=r.dataset.length||``;t.textContent=o,n.textContent=s,e.style.left=`${i}px`,e.style.top=`${a-8}px`,e.classList.remove(`hidden`)},i=()=>{e.classList.add(`hidden`)};document.addEventListener(`mousemove`,e=>{let t=e.target.closest(`.coil-segment`);t?r(t,e.clientX,e.clientY):i()}),document.addEventListener(`click`,e=>{let t=e.target.closest(`.coil-segment`);t?r(t,e.clientX,e.clientY):i()})}function u(t,n,r){if(t<.01)return 0;if(t<n)return t*1e4;if(r===e.TARGET_OFFCUT){let e=t%n;return e<.1||n-e<.1?-(t*50):Math.min(e,n-e)*5e3+t*2}return r===e.LONGEST_OFFCUT?-t:0}function d(e,t,n,r){let i=e.length*1e6;for(let a of e){let e=t-a.reduce((e,t)=>e+t,0);i+=u(e,n,r)}return i}function f(e,t,n,r){if(e.length===0)return{coils:[],penalty:0};let i=[...e].sort((e,t)=>t-e),a=[];for(let e of i){let i=-1,o=1/0;for(let s=0;s<a.length;s++){let c=a[s].reduce((e,t)=>e+t,0);if(c+e<=t){let a=p(t-(c+e),n,r);a<o&&(o=a,i=s)}}i===-1?a.push([e]):a[i].push(e)}return{coils:a,penalty:d(a,t,n,r)}}function p(t,n,r){if(r===e.TARGET_OFFCUT){let e=t%n;return(e<.1||n-e<.1)&&t>=n?-1e3:e}return t}function m(){console.log(`Platform Initialized`),o(i.loadFromLocalStorage(),e=>{c(f(e.getPiecesAsFlatArray(),e.coilLength,e.minOffcut,e.method),e)})}document.addEventListener(`DOMContentLoaded`,m);