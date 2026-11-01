const stage = document.querySelector('.stage');
const control = document.querySelector('.motion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
function move() {
  if (reduced.matches || paused) return;
  stage.style.setProperty('--drift', Math.min(scrollY * 0.1, 45) + 'px');
}
addEventListener('scroll', move, {passive:true});
stage.addEventListener('pointermove', event => {
  if (reduced.matches || paused || event.pointerType !== 'mouse') return;
  const bounds = stage.getBoundingClientRect();
  stage.style.setProperty('--angle', ((event.clientX - bounds.left) / bounds.width * 5 - 2.5) + 'deg');
});
stage.addEventListener('pointerleave', () => stage.style.setProperty('--angle','0deg'));
control.addEventListener('click', () => {
  paused = !paused;
  stage.classList.toggle('paused', paused);
  control.setAttribute('aria-pressed', String(paused));
  control.setAttribute('aria-label', paused ? 'Resume animation' : 'Pause animation');
  control.textContent = paused ? '▷' : 'Ⅱ';
  move();
});

if ('IntersectionObserver' in window) {
  const sections = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    }
  }, {rootMargin: '0px 0px -12% 0px'});
  document.querySelectorAll('.about, .experience dl > div, .project').forEach(row => sections.observe(row));
}
