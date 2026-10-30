/* A deterministic explanatory model, not an AI invocation or a deployment tool. */
(() => {
'use strict';
const stages = [
 {title:'Define what a learner should be able to do.',copy:'Start with the audience, prerequisite knowledge, and an observable learning outcome.',input:'A teaching question and the learner’s starting point.',ai:'Organize supplied material and identify missing definitions.',human:'Choose the goal and decide what belongs in this lesson.',output:'An agreed lesson brief.'},
 {title:'Give each interaction a teaching purpose.',copy:'Connect a concrete question to a prediction, an experiment, and an explanation.',input:'The lesson brief and reliable subject references.',ai:'Propose the sequence, notation, experiment, and understanding checks.',human:'Check prerequisite order and whether the activity teaches the intended distinction.',output:'A lesson plan and figure contracts.'},
 {title:'Construct the lesson and its reproduction.',copy:'Build the web experience and Python examples against explicit data and statistical definitions.',input:'The lesson plan, source data, figure contracts, and selected skills.',ai:'Edit HTML, CSS and JavaScript; prepare figures and runnable Python.',human:'Review the explanation, source choices, and meaning of each control.',output:'A local lesson, data downloads, and reproduction scripts.'},
 {title:'Inspect the result, then revise.',copy:'Compare calculations and inspect rendered formulas, axes, controls, and narrow screens.',input:'A browser preview, downloads, and a reviewable change.',ai:'Run relevant checks, inspect the page, identify defects, and propose repairs.',human:'Judge statistical interpretation and visual clarity. Resolve issues before release.',output:'Review evidence or a concrete repair request.'},
 {title:'Publish a reviewed change to the shared course.',copy:'Merge an accepted change, observe the Pages deployment, and inspect the live result.',input:'A checked diff and maintainer review.',ai:'Assist with the authorized release and verify changed pages and downloads.',human:'Decide whether the change is ready and maintain the shared version.',output:'A live lesson and a traceable revision.'}
];
let state={stage:0,defect:false};
const svg=document.querySelector('#workbench');
const ns='http://www.w3.org/2000/svg';
const base=`<defs><pattern id="grid" width="24" height="15" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#d8dbd2"/></pattern><filter id="shadow" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs><rect x="15" y="30" width="870" height="300" fill="url(#grid)"/><ellipse cx="454" cy="282" rx="368" ry="46" fill="#434b3820" filter="url(#shadow)"/><g stroke="#9a9f93" stroke-width="1.2" stroke-linejoin="round"><path d="M54 249 L775 249 L851 291 L130 291Z" fill="#e2e3d9"/><path d="M130 291 L851 291 L851 304 L130 304Z" fill="#d2d5c9"/><path d="M54 249 L130 291 L130 304 L54 262Z" fill="#c4c9bc"/><path d="M104 270 L789 270 M116 279 L804 279" fill="none" stroke="#b2b8ab"/><path d="M115 304v19l22 11v-30 M787 305v18l22 11v-30" fill="#cbd0c2"/></g>`;
let markup=base;
function gear(cx,cy){let points=[];for(let i=0;i<48;i++){let a=i*Math.PI/24,r=i%4<2?25:21;points.push(`${cx+Math.cos(a)*r},${cy+Math.sin(a)*r}`)}return `<g class="gear"><polygon points="${points.join(' ')}" fill="#e5e6dd"/><circle cx="${cx}" cy="${cy}" r="14" fill="#f6f5ef"/><circle cx="${cx}" cy="${cy}" r="5" fill="#b2b9ab"/></g>`}
for(let i=0;i<5;i++){
 let x=93+i*143;
 let screws=[[4,7],[77,7],[4,59],[77,59]].map(([cx,cy])=>`<g transform="translate(${cx},${cy})"><ellipse rx="3" ry="2" fill="#cbd0c1"/><path d="M-2 0h4"/></g>`).join('');
 let object='';
 if(i===0)object=`<path d="M12-3V-65H62V-3Z" fill="#e4e5db"/><path d="M12-65l15-12h48L62-65Z" fill="#f9f8f2"/><path d="M62-65l13-12V-15L62-3Z" fill="#c3c9ba"/><path class="lit" d="M21-57h31v43H21Z" fill="#faf9f5"/><path d="M27-47h19M27-38h19M27-29h12" stroke="#929b89"/><path d="M4 16l16-9h47l-15 9Z" fill="#f7f6ef"/>`;
 if(i===1)object=`<path d="M5 17l23-13h54L59 17Z" fill="#f7f6ef"/><path class="lit" d="M25 0v-61l44 3V0Z" fill="#f7f6ef"/><path d="M25-61l9-7 44 3-9 7Z" fill="#e8e9e0"/><path d="M69-58l9-7v57L69 0Z" fill="#c4cabd"/><path d="M33-47h13v12H33Z M51-44h11v12H51Z M39-24h15v12H39Z M40-35v6h7v5M56-32v8" fill="none"/><path d="M13 26l9-5h26l-9 5Z" fill="#d6dbcd"/>`;
 if(i===2)object=`<path d="M3 18l16-9h57l-17 9Z" fill="#dde1d4"/><path d="M12 10v-20h51v20Z" fill="#c7cebe"/><path d="M12-10l14-8h51l-14 8Z" fill="#f3f3e9"/><path d="M63-10l14-8v18L63 10Z" fill="#aeb9a2"/>${gear(40,-43)}<rect class="lit" x="31" y="-77" width="18" height="10" rx="2" fill="#ecece3"/><path d="M17-40h-9v-31h12 M64-41h11v-30H63" fill="none" stroke-width="3"/><circle cx="40" cy="-43" r="3" fill="#505c48"/>`;
 if(i===3)object=`<path d="M13 14v-71h6v71 M65 14v-71h6v71 M13-57h58v9H13Z" fill="#c8cebf"/><path d="M19-42h46v38H19Z" fill="#f5f4ec"/><path class="lit" d="M25-36h34v27H25Z" fill="#e5e8dc"/><path d="M31-22l7 6 15-13" stroke="#7c8970" stroke-width="2" fill="none"/><path d="M6 20l17-9h48l-17 9Z" fill="#d8decd"/><circle class="signal" cx="44" cy="-58" r="4"/>`;
 if(i===4)object=`<path d="M5 15V-23h63v38Z" fill="#c3cdb7"/><path d="M5-23l15-8h63l-15 8Z" fill="#e9ece1"/><path d="M68-23l15-8V6L68 15Z" fill="#aebca0"/><path class="lit" d="M20-32V-67h42v35Z" fill="#f6f5ee"/><path d="M20-67l9-6h42l-9 6Z" fill="#eaedde"/><path d="M62-67l9-6v35l-9 6Z" fill="#c9d2bc"/><path d="M27-57h28M27-48h28M27-39h18"/><path d="M16-10h40 M16-4h40 M16 2h24" stroke="#96a684"/>`;
 markup+=`<g class="station-shape${i===0?' active':''}" data-machine-stage="${i}" transform="translate(${x} 220)" stroke="#8d9881" stroke-width="1.1" stroke-linejoin="round"><path d="M-15 5L64 5l36 20H21Z" fill="#f3f3e9"/><path d="M21 25h79v7H21Z" fill="#d1d7c7"/><path d="M-15 5l36 20v7L-15 12Z" fill="#bdc6b0"/>${object}<g transform="translate(0 -13)">${screws}</g><rect x="24" y="36" width="23" height="13" rx="2" fill="#f8f7f0"/><text x="35" y="46" text-anchor="middle" stroke="none" fill="#6f7865" font-size="8" font-family="monospace">0${i+1}</text><circle class="signal" cx="82" cy="23" r="3"/></g>`;
}
markup+=`<g class="carriage" id="carriage" transform="translate(0 0)" stroke="#af512c" stroke-width="1.2"><path d="M96 273l18-10h30l-18 10Z" fill="#f0bc96"/><path d="M96 273l30 0v8H96Z" fill="#cc7950"/><circle cx="102" cy="282" r="3" fill="#6b5a45"/><circle cx="121" cy="282" r="3" fill="#6b5a45"/><path d="M103 260v-9h24v9" fill="#fbecdb"/></g>`;
svg.insertAdjacentHTML('beforeend',markup);
const buttons=[...document.querySelectorAll('[data-stage]')];
const shapes=[...document.querySelectorAll('[data-machine-stage]')];
function render(){
 const s=stages[state.stage];
 for(const [id,key] of [['operation-title','title'],['operation-copy','copy'],['input','input'],['ai-work','ai'],['human-work','human'],['output','output']])document.getElementById(id).textContent=s[key];
 document.getElementById('machine-count').textContent=`STATION 0${state.stage+1} / 05`;
 buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===state.stage)));
 shapes.forEach((g,i)=>g.classList.toggle('active',i===state.stage));
 document.getElementById('carriage').setAttribute('transform',`translate(${state.stage*143} 0)`);
 const blocked=state.defect;
 document.getElementById('formula-demo').classList.toggle('has-defect',blocked);
 document.getElementById('gate-status').textContent=blocked?'Demo check: formula alignment fails. Repair before release.':state.repaired?'Demo check: alignment repaired; inspection can proceed.':'Demo check: no defect introduced.';
 document.getElementById('gate-status').classList.toggle('blocked',blocked);
 document.getElementById('repair').disabled=!blocked;
 document.getElementById('inject-defect').disabled=blocked;
 buttons[4].disabled=blocked;
 const next=document.getElementById('next-stage');
 next.disabled=state.stage===3&&blocked;
 next.textContent=state.stage===4?'Back to the brief ↺':state.stage===3&&blocked?'Repair required':'Next station →';
 if(state.stage===3&&blocked){document.getElementById('output').textContent='Revision requested: align the relation signs, then inspect again.';document.getElementById('operation-copy').textContent='The illustrative visual check failed. Repair the defect before moving to release.'}
}
buttons.forEach((b,i)=>b.addEventListener('click',()=>{state.stage=i;render()}));
document.getElementById('next-stage').addEventListener('click',()=>{if(state.stage===3&&state.defect)return;state.stage=(state.stage+1)%5;render()});
document.getElementById('restart').addEventListener('click',()=>{state={stage:0,defect:false};render()});
document.getElementById('inject-defect').addEventListener('click',()=>{state.defect=true;state.repaired=false;state.stage=3;render()});
document.getElementById('repair').addEventListener('click',()=>{state.defect=false;state.repaired=true;state.stage=2;render()});
render();
const links=[...document.querySelectorAll('.side nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
let scheduled=false;
function updateNav(){let active=0;sections.forEach((el,i)=>{if(el.getBoundingClientRect().top<200)active=i});links.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});scheduled=false}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateNav)}},{passive:true});updateNav();
})();
