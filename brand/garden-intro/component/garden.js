/* Glow Garden: portable, dependency-free decorative Web Component. */
(() => {
  'use strict';
  const scriptURL = document.currentScript.src;
  const assetRoot = new URL('../assets/webp/', scriptURL).href;
  const stylesheet = new URL('garden.css', scriptURL).href;
  const butterfly = (name, variant) => `
    <div class="flight flight--${variant}">
      <div class="butterfly butterfly--${variant}">
        <img class="wing wing--left" src="${assetRoot}butterfly-${name}.webp" width="360" height="240" alt="" draggable="false">
        <img class="wing wing--right" src="${assetRoot}butterfly-${name}.webp" width="360" height="240" alt="" draggable="false">
        <img class="butterfly-body" src="${assetRoot}butterfly-${name}.webp" width="360" height="240" alt="" draggable="false">
      </div>
    </div>`;

  class GlowGarden extends HTMLElement {
    static get observedAttributes() {
      return ['paused', 'sun-duration', 'wind-duration', 'flight-duration', 'flap-duration'];
    }
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="${stylesheet}">
        <div class="scene" role="img" aria-label="Tranh Á Đông tông be vàng: mặt trời trôi sau khung họa tiết, tán lá đung đưa và hai con bướm bay.">
          <img class="background" src="${assetRoot}background.webp" width="1080" height="1920" alt="" decoding="async" fetchpriority="high" draggable="false">
          <div class="sun-motion"><img class="sun" src="${assetRoot}sun-full.webp" width="800" height="800" alt="" decoding="async" draggable="false"></div>
          <img class="screen" src="${assetRoot}background.webp" width="1080" height="1920" alt="" decoding="async" draggable="false">
          <img class="bamboo" src="${assetRoot}bamboo.webp" width="1200" height="800" alt="" decoding="async" draggable="false">
          ${butterfly('ivory', 'ivory')}
          ${butterfly('olive', 'olive')}
          <div class="content"><slot></slot></div>
        </div>`;
      // Suspend decorative motion when the component is outside the viewport.
      if ('IntersectionObserver' in window) {
        this._observer = new IntersectionObserver(entries => {
          this.toggleAttribute('data-offscreen', !entries[0].isIntersecting);
        }, {rootMargin:'80px'});
      }
      this._visibility = () => this.toggleAttribute('data-hidden', document.hidden);
    }
    connectedCallback() {
      this._observer?.observe(this);
      document.addEventListener('visibilitychange', this._visibility);
      this._visibility();
      for (const name of GlowGarden.observedAttributes) this.attributeChangedCallback(name, null, this.getAttribute(name));
    }
    disconnectedCallback() {
      this._observer?.disconnect();
      document.removeEventListener('visibilitychange', this._visibility);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'paused') return;
      const defaults = {'sun-duration':32,'wind-duration':7,'flight-duration':18,'flap-duration':0.46};
      const value = Number(newValue);
      const seconds = newValue !== null && Number.isFinite(value) && value > 0 ? value : defaults[name];
      this.style.setProperty(`--${name}`, `${Math.max(0.15,Math.min(180,seconds))}s`);
    }
    pause() { this.setAttribute('paused',''); }
    play() { this.removeAttribute('paused'); }
    restart() {
      this.shadowRoot.querySelector('.scene').getAnimations({subtree:true}).forEach(animation => { animation.currentTime = 0; });
    }
    get paused() { return this.hasAttribute('paused'); }
    set paused(value) { value ? this.pause() : this.play(); }
  }
  if (!customElements.get('glow-garden')) customElements.define('glow-garden',GlowGarden);
})();
