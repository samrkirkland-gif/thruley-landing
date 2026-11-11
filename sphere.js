// Sphere rendering adapted from the inspected Teamtailor public Sphere component.
(()=>{if(typeof window>`u`||customElements.get(`thruley-sphere`))return;let e=`uRes.uCount.uCol.uBase.uBg.uTransparent.uOrbitPhase.uBlobPhase.uTime.uOrbitRadius.uBlobSize.uWobble.uTilt.uTiltY.uSpread.uColorSpread.uBaseAmount.uIntensity.uSize.uEdge.uCore.uRim.uRimPow.uHaze.uGrain.uGlow.uBend`.split(`.`);function t(e,t,n,r){let i=(t,n)=>{let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r));return r},a=e.createProgram();if(e.attachShader(a,i(e.VERTEX_SHADER,t)),e.attachShader(a,i(e.FRAGMENT_SHADER,n)),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS))throw Error(e.getProgramInfoLog(a));e.useProgram(a),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let o=e.getAttribLocation(a,`a`);e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);let s={};return r.forEach(t=>s[t]=e.getUniformLocation(a,t)),s}function n(e){return!e||!e.transparent?1:Math.min(1,e.size*(e.glow>0?2:1.04))}function r(e,t,n,r,i=1){let a=e=>{let t=parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]},o=e.drawingBufferWidth,s=e.drawingBufferHeight,c=Math.PI*2*r/n.loop,l=n.cycles,u=Math.min(e.canvas.clientWidth,e.canvas.clientHeight)*n.size*i,d=Math.min(1,Math.max(0,(u-64)/176));e.viewport(0,0,o,s),e.uniform2f(t.uRes,o,s);let f=n.colors.slice(0,6),p=new Float32Array(18);f.forEach((e,t)=>p.set(a(e),t*3)),e.uniform1i(t.uCount,f.length),e.uniform3fv(t.uCol,p),e.uniform3fv(t.uBase,a(n.base)),e.uniform3fv(t.uBg,a(n.bg)),e.uniform1f(t.uTransparent,+!!n.transparent),e.uniform1f(t.uOrbitPhase,l.orbitTurns*c),e.uniform1f(t.uBlobPhase,l.driftCycles*c),e.uniform1f(t.uTime,Math.round(r*30)/30),e.uniform1f(t.uOrbitRadius,n.orbitRadius),e.uniform1f(t.uBlobSize,n.blobSize),e.uniform1f(t.uWobble,n.wobble),e.uniform1f(t.uTilt,n.tilt),e.uniform1f(t.uTiltY,n.tiltY||0),e.uniform1f(t.uColorSpread,n.colorSpread??1),e.uniform1f(t.uSpread,n.spread),e.uniform1f(t.uBaseAmount,n.baseAmount),e.uniform1f(t.uIntensity,n.intensity),e.uniform1f(t.uSize,n.size*i),e.uniform1f(t.uEdge,n.edgeSoft),e.uniform1f(t.uCore,n.core),e.uniform1f(t.uRim,n.rim*d),e.uniform1f(t.uRimPow,n.rimPower),e.uniform1f(t.uHaze,n.haze*d),e.uniform1f(t.uGrain,n.grain*d),e.uniform1f(t.uGlow,n.glow),e.uniform1f(t.uBend,n.bend||0),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLE_STRIP,0,4)}class i extends HTMLElement{static get observedAttributes(){return[`data-config`,`data-start`,`data-paused`]}connectedCallback(){if(!document.getElementById(`thruley-sphere-style`)){let e=document.createElement(`style`);e.id=`thruley-sphere-style`,e.textContent=`:where(thruley-sphere){display:block;position:relative;width:100%;aspect-ratio:1}:where(thruley-sphere)>canvas{position:absolute;inset:0;width:100%;height:100%;display:block}`,document.head.appendChild(e)}this._canvas||(this._canvas=document.createElement(`canvas`),this._canvas.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),this._gl=null,this._stop()}),this._canvas.addEventListener(`webglcontextrestored`,()=>{this._init(),this._kick()})),this._canvas.isConnected||this.appendChild(this._canvas),this._read(),this._init(),this._clock=0,this._last=performance.now(),this._rate===void 0&&(this._rate=1),this._ro=new ResizeObserver(()=>this._resize()),this._ro.observe(this),this._io=new IntersectionObserver(e=>{this._visible=e[e.length-1].isIntersecting,this._kick()}),this._io.observe(this),this._mq=matchMedia(`(prefers-reduced-motion: reduce)`),this._onMq=()=>this._kick(),this._mq.addEventListener&&this._mq.addEventListener(`change`,this._onMq)}disconnectedCallback(){this._stop(),this._ro&&this._ro.disconnect(),this._io&&this._io.disconnect(),this._mq&&this._mq.removeEventListener&&this._mq.removeEventListener(`change`,this._onMq)}get playbackRate(){return this._rate??1}set playbackRate(e){this._tick(),this._rate=e}attributeChangedCallback(){this.isConnected&&this._canvas&&(this._read(),this._resize(),this._kick())}_read(){try{this._cfg=JSON.parse(this.getAttribute(`data-config`)||`null`)}catch{this._cfg=null}this._start=parseFloat(this.getAttribute(`data-start`))||0}_init(){if(this._gl)return;let n=this._canvas.getContext(`webgl`,{alpha:!0,premultipliedAlpha:!0,antialias:!1});if(!n)this.setAttribute(`data-fallback`,``);else try{this._U=t(n,`attribute vec2 a; varying vec2 v; void main(){ v = a; gl_Position = vec4(a,0.,1.); }`,`
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform int uCount;
uniform vec3 uCol[6];
uniform vec3 uBase, uBg;
uniform float uTransparent;
uniform float uOrbitPhase, uBlobPhase, uTime;
uniform float uOrbitRadius, uBlobSize, uWobble, uTilt, uTiltY, uSpread, uColorSpread;
uniform float uBaseAmount, uIntensity;
uniform float uSize, uEdge, uCore, uRim, uRimPow, uHaze, uGrain, uGlow, uBend;

const float PI = 3.14159265;

vec3 getCol(int i){
  vec3 c = uCol[0];
  for(int k=0;k<6;k++){ if(k==i) c = uCol[k]; }
  return c;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 p = v * uRes / min(uRes.x, uRes.y);   // shorter side spans -1..1, so the sphere fits any frame shape
  vec2 q = p / uSize;
  float r = length(q);
  float aa = max(uEdge, 1.5 / (min(uRes.x, uRes.y) * uSize));
  float mask = 1. - smoothstep(1. - aa, 1. + aa * .25, r);
  vec3 n = vec3(q, sqrt(max(0., 1. - min(r * r, 1.))));
  // Edge bend: read the colors as if printed on a ball, so they bulge in the middle and
  // compress as they curve away toward the rim.
  // The pattern sits on a slightly tilted ball: straight color boundaries curve into arcs and
  // squeeze together as they wrap around the rim.
  float rc = min(r, 1.);
  vec3 sp = vec3(r > 1e-4 ? q / r * rc : q, sqrt(max(0., 1. - rc * rc)));
  float ta = uBend * 1.05, tb = uBend * .7;
  sp.yz = mat2(cos(ta), sin(ta), -sin(ta), cos(ta)) * sp.yz;
  sp.xz = mat2(cos(tb), sin(tb), -sin(tb), cos(tb)) * sp.xz;
  vec2 bent = sp.xy / max(length(sp.xy), 1e-4) * acos(clamp(sp.z, -1., 1.)) / (PI * .5);
  bent *= 1. + .7 * pow(rc, 3.);
  vec2 qb = mix(q, bent, uBend);

  // Blobs travel along a ring (optionally tilted into 3D) on top of the core color.
  float wsum = 0.; vec3 acc = vec3(0.);
  float esum = 0.; vec3 eacc = vec3(0.);   // the concentrated (hotspot) version of the same blobs
  float ct = cos(uTilt), st = sin(uTilt), cy = cos(uTiltY), sy = sin(uTiltY);
  for (int i = 0; i < 6; i++) {
    if (i >= uCount) break;
    float fi = float(i);
    float off = fi / float(uCount) * 2. * PI * uSpread + fi * (1. - uSpread) * .45;
    float ang = uOrbitPhase + off + uWobble * .6 * sin(uBlobPhase + fi * 2.1);
    float rad = uOrbitRadius * (1. + uWobble * .25 * sin(uBlobPhase * 2. + fi * 1.3));
    vec3 bp = vec3(cos(ang) * rad, sin(ang) * rad, 0.);
    bp = vec3(bp.x, bp.y * ct, bp.y * st);           // tilt ring around the x axis
    bp = vec3(bp.x * cy - bp.z * sy, bp.y, bp.x * sy + bp.z * cy); // then around the y axis
    float persp = 1. + bp.z * .35;                    // nearer = bigger
    float depthFade = mix(1., clamp(.6 + bp.z * .5, 0., 1.4), step(.001, abs(uTilt) + abs(uTiltY)));
    float sz = uBlobSize * persp;
    float d = length(qb - bp.xy);
    float w = exp(-d * d / (sz * sz)) * uIntensity * depthFade;
    acc += getCol(i) * w; wsum += w;
    // Hotspot: an exponential falloff peaks sharply at full color and trails off in a long soft tint.
    float re = uBlobSize * persp * mix(.42, .9, uColorSpread);
    float e = exp(-(sqrt(d * d + .0016) - .04) / re) * depthFade;
    eacc += getCol(i) * e; esum += e;
  }
  // Color Spread blends two looks. At 1 the colors saturate quickly and wash over the whole sphere.
  // At 0 each color is a hotspot: full strength at one point, falling off fast and then trailing a long pale tint.
  // The tint never drops below 30%, so the whole sphere stays filled with the nearest color instead of going white.
  vec3 wash = mix(uBase, acc / max(wsum, 1e-6), 1. - exp(-wsum / max(uBaseAmount, .05)));
  vec3 spot = mix(uBase, eacc / max(esum, 1e-6), mix(.3, 1., 1. - exp(-5. * esum)));
  vec3 col = mix(spot, wash, smoothstep(0., 1., uColorSpread));

  // Self-illumination: brightest at the core, no external light.
  col *= mix(1., .45 + .75 * n.z, uCore);
  // Rim glow and edge haze fade toward the background color, so the edge melts into it.
  float spreadT = smoothstep(0., 1., uColorSpread);
  float fres = pow(1. - n.z, mix(5., uRimPow, spreadT));
  // Concentrated colors often sit at the edge, so as Color Spread goes down the rim glow narrows to a thin line.
  col = mix(col, mix(col, uBg, .85), clamp(fres * uRim * mix(.6, 1., spreadT), 0., 1.));
  float hz = smoothstep(.55, 1., r) * uHaze;
  col = mix(col, mix(col, uBg, .7), hz);

  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.) - .5) * uGrain;
  col = clamp(col, 0., 1.);

  float g = clamp(uGlow * 1.4 * exp(-max(r - 1., 0.) * 3.5), 0., 1.) * step(1. - aa, r);
  vec3 glowCol = (uCount > 0) ? mix(getCol(0), uBase, .3) : uBase;
  float alpha = mask;
  vec3 outc = col * mask + glowCol * g * (1. - mask);
  alpha = alpha + g * (1. - mask);
  if (uTransparent < .5) { outc = outc + uBg * (1. - alpha); alpha = 1.; }
  gl_FragColor = vec4(outc, alpha);
}`,e),this._gl=n}catch{this.setAttribute(`data-fallback`,``)}}_resize(){let e=this.getBoundingClientRect(),t=this._canvas,r=n(this._cfg),i=Math.min(e.width,e.height),a=Math.max(1,Math.ceil(i*r)),o=r<1?a:e.width,s=r<1?a:e.height;t.style.cssText=r<1?`inset:auto;left:${Math.round((e.width-a)/2)}px;top:${Math.round((e.height-a)/2)}px;width:${a}px;height:${a}px`:``,this._sizeScale=r<1?i/a:1;let c=Math.min(window.devicePixelRatio||1,2),l=parseInt(this.getAttribute(`data-max-resolution`),10)||1200,u=Math.min(c,l/Math.max(o,s,1)),d=Math.max(1,Math.round(o*u)),f=Math.max(1,Math.round(s*u));(t.width!==d||t.height!==f)&&(t.width=d,t.height=f,this._draw())}_still(){return this.hasAttribute(`data-paused`)||this._mq&&this._mq.matches}_draw(){if(!this._gl||!this._cfg||this._gl.isContextLost())return;let e=this._cfg.loop;this._tick();let t=this._still()?this._start:((this._clock+this._start)%e+e)%e;r(this._gl,this._U,this._cfg,t,this._sizeScale)}_tick(){let e=performance.now();this._last!==void 0&&(this._clock+=(e-this._last)/1e3*(this._rate??1)),this._last=e}_stop(){this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_kick(){let e=this._visible&&this._gl&&this._cfg&&!this._still();if(e&&!this._raf){let e=()=>{this._draw(),this._raf=requestAnimationFrame(e)};this._raf=requestAnimationFrame(e)}e||(this._stop(),this._draw())}}customElements.define(`thruley-sphere`,i)})();