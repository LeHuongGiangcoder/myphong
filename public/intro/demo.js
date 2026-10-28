(() => {
  'use strict';
  const scene = document.getElementById('garden');
  const toggle = document.getElementById('toggle');
  const restart = document.getElementById('restart');
  const slider = document.getElementById('sun-speed');
  const output = document.getElementById('duration');
  const status = document.getElementById('motion-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => {
    toggle.textContent = scene.paused ? 'Tiếp tục' : 'Tạm dừng';
    toggle.setAttribute('aria-pressed', String(scene.paused));
    toggle.setAttribute('aria-label', scene.paused ? 'Tiếp tục chuyển động' : 'Tạm dừng chuyển động');
    toggle.disabled = restart.disabled = slider.disabled = reducedMotion.matches;
    status.textContent = reducedMotion.matches ? 'Đang dùng ảnh tĩnh theo cài đặt Giảm chuyển động của thiết bị.' : '';
  };
  toggle.addEventListener('click', () => { scene.paused = !scene.paused; sync(); });
  restart.addEventListener('click', () => { scene.restart(); scene.play(); sync(); });
  slider.addEventListener('input', () => {
    scene.setAttribute('sun-duration', slider.value);
    output.textContent = `${slider.value} giây`;
  });
  reducedMotion.addEventListener('change', sync);
  customElements.whenDefined('glow-garden').then(sync);
})();
