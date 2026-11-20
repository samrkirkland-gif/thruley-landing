const uiStages=[['overview','WORKSPACE OVERVIEW'],['prepare','DISCLOSURE & EVIDENCE'],['progress','REQUESTS & FOLLOW-UPS'],['settle','SETTLEMENT & ARCHIVE']];
function stage(n){
 document.querySelectorAll('[data-stage]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1});
 const [key,label]=uiStages[n];
 document.querySelectorAll('[data-ui-device]').forEach(image=>{image.src=`assets/ui-${key}-${image.dataset.uiDevice}-20261120.webp`;image.alt=`Current Thruley ${label.toLowerCase()} on ${image.dataset.uiDevice}, showing fictional example data`});
 document.querySelector('[data-ui-stage-label]').textContent=label;
}
document.querySelectorAll('[data-stage]').forEach(b=>{b.onclick=()=>stage(+b.dataset.stage);b.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const n=(+b.dataset.stage+(e.key==='ArrowRight'?1:3))%4;stage(n);document.querySelector(`[data-stage="${n}"]`).focus()}}});
const menu=document.querySelector('#menu'),nav=document.querySelector('#navigation'),island=document.querySelector('.nav-island'),islandMenu=document.querySelector('.island-menu');
function toggleMenu(open){nav.hidden=!open;[menu,islandMenu].forEach(b=>b.setAttribute('aria-expanded',String(open)))}
[menu,islandMenu].forEach(b=>b.onclick=()=>toggleMenu(nav.hidden));document.addEventListener('click',e=>{if(!nav.hidden&&!nav.contains(e.target)&&!menu.contains(e.target)&&!islandMenu.contains(e.target))toggleMenu(false)});nav.querySelectorAll('a').forEach(a=>a.onclick=()=>toggleMenu(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggleMenu(false);islandMenu.focus()}});
const islandMark=island.querySelector('.island-brand');
const islandMarkMotion=matchMedia('(prefers-reduced-motion: reduce)');
let islandMarkVisible=false;
function updateIslandMark(){
 const visible=window.innerWidth<=700||island.classList.contains('is-shown');
 if(visible&&!islandMarkVisible&&!islandMarkMotion.matches){
  islandMark.querySelector('thruley-sphere')?.removeAttribute('data-paused');islandMark.classList.remove('is-drawing');void islandMark.offsetWidth;islandMark.classList.add('is-drawing');
 }
 if(!visible||islandMarkMotion.matches){islandMark.classList.remove('is-drawing');islandMark.querySelector('thruley-sphere')?.setAttribute('data-paused','')}
 islandMarkVisible=visible;
}
islandMarkMotion.addEventListener('change',updateIslandMark);
window.addEventListener('resize',updateIslandMark);
let scheduled=false;function scrollLayout(){island.classList.toggle('is-shown',window.scrollY>180);updateIslandMark();scheduled=false}window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollLayout)}},{passive:true});scrollLayout();
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
const track=document.querySelector('.story-track');document.querySelector('#next').onclick=()=>track.scrollBy({left:track.clientWidth*.8,behavior:'smooth'});document.querySelector('#prev').onclick=()=>track.scrollBy({left:-track.clientWidth*.8,behavior:'smooth'});
const dialog=document.querySelector('#detail');document.querySelector('#approve')?.addEventListener('click',()=>dialog.showModal());dialog.querySelectorAll('.close,.close-detail').forEach(b=>b.onclick=()=>dialog.close());dialog.onclick=e=>{if(e.target===dialog&&e.offsetX<0)dialog.close()};
const interestForm=document.querySelector('#signup');
const interestEndpoint=window.THRULEY_INTEREST_ENDPOINT||'';
if(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(interestEndpoint))interestForm.action=interestEndpoint;
interestForm.addEventListener('submit',event=>{
 const note=document.querySelector('#formNote');
 if(!interestForm.reportValidity()){event.preventDefault();return}
 if(!interestEndpoint||interestForm.action!==interestEndpoint){event.preventDefault();note.textContent='Registration is being connected. Please email hello@thruley.com with your name and business to register your interest.';return}
 interestForm.querySelector('[name=submission_id]').value||=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 interestForm.querySelector('button[type=submit]').disabled=true;
 note.textContent='Submitting your interest securely…';
});
window.addEventListener('pageshow',()=>{interestForm.querySelector('button[type=submit]').disabled=false});

// Reveal the final 15 words using the source component's timing and observer margin.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const quoteObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting)entry.target.dataset.quoteReveal='in';
  else if(entry.boundingClientRect.top>0)entry.target.dataset.quoteReveal='armed';
 }),{rootMargin:'0px 0px -15% 0px'});
 document.querySelectorAll('[data-quote-reveal]').forEach(quote=>{
  const words=quote.textContent.split(/(\s+)/);
  const wordCount=words.filter(word=>word.trim()).length;
  let wordIndex=0,animatedIndex=0;
  quote.replaceChildren(...words.map(word=>{
   if(!word.trim())return document.createTextNode(word);
   if(wordIndex++<wordCount-15)return document.createTextNode(word);
   const span=document.createElement('span');
   span.className='quote-word';span.textContent=word;
   span.style.setProperty('--i',String(animatedIndex++));return span;
  }));
  quote.dataset.quoteReveal='armed';quoteObserver.observe(quote);
 });
}

// Local illustrative customizer; no account or brand settings are saved.
const agencyBrands={banksia:{name:'banksia',accent:'#004aad',paper:'#f4f7fc',font:'Arial,sans-serif',signoff:'Banksia Property'},grove:{name:'grove',accent:'#395c48',paper:'#eef2e9',font:'Georgia,serif',signoff:'Grove Property'},forma:{name:'forma',accent:'#7d4637',paper:'#f5eeea',font:'Arial,sans-serif',signoff:'Forma Property'}};
const voiceSamples={warm:'Hi Alex, a quick update on your property. Your documents are ready whenever you are.',polished:'Dear Alex, your property documents are prepared and available for your review at your convenience.',direct:'Alex, your property documents are ready. Please review them to confirm the next step.'};
const customizer=document.querySelector('.customizer');
customizer.querySelectorAll('[data-brand]').forEach(button=>button.addEventListener('click',()=>{
 const brand=agencyBrands[button.dataset.brand];
 customizer.style.setProperty('--agency-accent',brand.accent);customizer.style.setProperty('--agency-paper',brand.paper);customizer.style.setProperty('--agency-font',brand.font);
 customizer.querySelectorAll('.agency-wordmark').forEach(e=>{e.firstChild.textContent=brand.name});customizer.querySelector('.voice-signoff').textContent='Jess, from '+brand.signoff;
 customizer.querySelectorAll('[data-brand]').forEach(e=>e.setAttribute('aria-pressed',String(e===button)));
}));
customizer.querySelectorAll('[data-voice]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelector('#voicePreview').textContent=voiceSamples[button.dataset.voice];
 customizer.querySelectorAll('[data-voice]').forEach(e=>e.setAttribute('aria-pressed',String(e===button)));
}));
// Recycle real cards at each step; flank copies keep both edges filled during travel.
const editorTrack=customizer.querySelector('.customizer-track');
const editorCards=[...editorTrack.children];
editorCards.unshift(editorCards.pop());
const editorMotion=matchMedia('(prefers-reduced-motion: reduce)');
let editorAnimation,editorVisible=false,editorFocused=false,editorStopped=false;
function editorScale(){return getComputedStyle(editorTrack).zoom==='0.65'?.65:1}
function editorPosition(){const scale=editorScale();return (customizer.clientWidth/scale-250)/2-2*278}
function editorArrange(){
 const flank=card=>{const copy=card.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.inert=true;copy.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));return copy};
 editorTrack.replaceChildren(flank(editorCards[2]),...editorCards,flank(editorCards[0]));
 editorTrack.style.transform=`translateX(${editorPosition()}px)`;
}
function editorRun(){
 if(editorStopped||editorMotion.matches||!editorVisible||editorFocused)return;
 const start=editorPosition();
 editorAnimation=editorTrack.animate([
  {transform:`translateX(${start}px)`,offset:0},
  {transform:`translateX(${start}px)`,offset:.22,easing:'cubic-bezier(.22,1,.36,1)'},
  {transform:`translateX(${start-278}px)`,offset:1}
 ],{duration:3600,fill:'forwards'});
 editorAnimation.onfinish=()=>{
  editorCards.push(editorCards.shift());editorAnimation.cancel();editorAnimation=null;editorArrange();editorRun();
 };
}
function editorUpdate(){
 if(editorMotion.matches){editorAnimation?.cancel();editorAnimation=null;editorArrange();return}
 if(!editorVisible||editorFocused){editorAnimation?.pause();return}
 if(editorAnimation)editorAnimation.play();else editorRun();
}
editorArrange();
new IntersectionObserver(entries=>{editorVisible=entries[0].isIntersecting;editorUpdate()}).observe(customizer);
customizer.addEventListener('focusin',()=>{editorFocused=true;editorUpdate()});
customizer.addEventListener('focusout',()=>{queueMicrotask(()=>{editorFocused=customizer.contains(document.activeElement);editorUpdate()})});
editorMotion.addEventListener('change',editorUpdate);
new ResizeObserver(()=>{editorAnimation?.cancel();editorAnimation=null;editorArrange();editorUpdate()}).observe(customizer);

const scope=document.querySelector('.file-scope'),scopeNumber=scope.querySelector('.scope-number');
const scopeMotion=matchMedia('(prefers-reduced-motion: reduce)');
let scopeCounted=false,scopeFrame;
function scopeFinish(){cancelAnimationFrame(scopeFrame);scopeNumber.textContent='100'}
scopeMotion.addEventListener('change',()=>{if(scopeMotion.matches)scopeFinish()});
new IntersectionObserver(entries=>entries.forEach(entry=>{
 scope.classList.toggle('is-active',entry.isIntersecting);
 if(!entry.isIntersecting||scopeCounted)return;
 scopeCounted=true;if(scopeMotion.matches){scopeFinish();return}
 const start=performance.now();
 function count(now){const progress=Math.min(1,(now-start)/1800);scopeNumber.textContent=String(Math.round(100*(1-(1-progress)**3)));if(progress<1)scopeFrame=requestAnimationFrame(count)}
 scopeFrame=requestAnimationFrame(count);
}),{threshold:.25}).observe(scope);

new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-playing',entry.isIntersecting))).observe(document.querySelector('.oversight'));
// Keep the current mobile capture aligned with the photographed phone as the image covers its panel.
const deskSizer=new ResizeObserver(entries=>entries.forEach(({target,contentRect})=>{
 const scale=Math.max(contentRect.width/1536,contentRect.height/1024);
 target.querySelector('.oversight-artboard').style.transform=`translate(-50%,-50%) scale(${scale})`;
}));
deskSizer.observe(document.querySelector('.oversight-art'));

const sourceTrack=document.querySelector('.source-carousel .source-logos');
const sourceOriginals=[...sourceTrack.children];
sourceOriginals.forEach(logo=>{const copy=logo.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.tabIndex=-1;copy.inert=true;sourceTrack.append(copy)});
function sizeSourceLoop(){const gap=parseFloat(getComputedStyle(sourceTrack).gap)||0;const width=sourceOriginals.reduce((total,logo)=>total+logo.getBoundingClientRect().width+gap,0);sourceTrack.style.setProperty('--source-loop-width',width+'px')}
new ResizeObserver(sizeSourceLoop).observe(document.querySelector('.source-carousel'));sizeSourceLoop();

islandMark.querySelector('.island-thinking').addEventListener('animationend',()=>islandMark.querySelector('thruley-sphere')?.setAttribute('data-paused',''));
