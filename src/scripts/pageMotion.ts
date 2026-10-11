import { gsap } from 'gsap';
import { animateDoors, createDoors } from './pageDoors';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

// Keep scrolling native; replay reveals only when entering on a downward pass.
const selector = '.practice-card, .principle-grid > div, .register-row, .directory-card, .about-feature-card, .cluster-header, .research-copy, .section-heading, .studio-footer > div, .index-row, .index-title, .index-deck, .cv-index-list > li, .gsap-stagger-item, [data-academic-reveal]';
const activeReveals = new Map<Element, gsap.core.Tween>();
const armed = new WeakSet<Element>();
let previousY = window.scrollY;
let scrollingDown = true;

function finishReveals() {
  activeReveals.forEach((tween, element) => {
    tween.kill();
    gsap.set(element, { clearProps: 'transform,opacity' });
  });
  activeReveals.clear();
}
window.addEventListener('scroll', () => {
  const nextY = window.scrollY;
  if (nextY === previousY) return;
  scrollingDown = nextY > previousY;
  previousY = nextY;
  // Upward scrolling shows settled content, without a reverse or fade-out.
  if (!scrollingDown) finishReveals();
}, { passive: true });
reduced.addEventListener('change', () => { if (reduced.matches) finishReveals(); });

const reveals = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const element = entry.target;
    if (!entry.isIntersecting) {
      // Re-arm only after the item is below the viewport again. Do not hide it.
      if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? innerHeight)
        && !activeReveals.has(element)) armed.add(element);
      return;
    }
    const replay = armed.has(element);
    armed.delete(element);
    if (!replay || !scrollingDown || reduced.matches) return;
    const tween = gsap.fromTo(element, { y: 36, opacity: 0.12 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
      clearProps: 'transform,opacity', overwrite: 'auto',
      onComplete: () => { activeReveals.delete(element); },
    });
    activeReveals.set(element, tween);
  });
}, { threshold: 0 });

// Animate the content itself, avoiding overlapping animations on parent wrappers.
document.querySelectorAll(selector).forEach(element => {
  if (element.querySelector(selector)) return;
  armed.add(element);
  reveals.observe(element);
});

const cursor = document.getElementById('custom-cursor');
if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power2.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power2.out' });
  let positioned = false;
  document.addEventListener('pointermove', event => {
    if (!positioned || reduced.matches) {
      gsap.set(cursor, { x: event.clientX, y: event.clientY });
      positioned = true;
    } else {
      xTo(event.clientX);
      yTo(event.clientY);
    }
    cursor.style.opacity = '1';
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  document.querySelectorAll('a, button, .interactive').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 3, duration: 0.2, overwrite: 'auto' }));
    el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: 'auto' }));
  });
  // Only magnetic controls need geometry reads; ordinary links never move.
  document.querySelectorAll<HTMLElement>('.magnetic').forEach(el => {
    el.addEventListener('pointermove', event => {
      if (reduced.matches) return;
      const rect = el.getBoundingClientRect();
      gsap.to(el, { x: (event.clientX - rect.left - rect.width / 2) * 0.3,
        y: (event.clientY - rect.top - rect.height / 2) * 0.3,
        duration: 0.3, overwrite: 'auto' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.3, overwrite: 'auto' }));
  });
}

let navigating = false;
let departure: gsap.core.Tween | undefined;
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  departure?.kill();
  navigating = false;
  document.querySelectorAll('[data-page-door], #pre-door-left, #pre-door-right').forEach(panel => {
    gsap.killTweensOf(panel);
    panel.remove();
  });
});

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  if (!link || link.origin !== location.origin || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const target = new URL(link.href);
  if (target.pathname === location.pathname && target.search === location.search) return;
  // Let files and other non-page resources retain the browser's normal behavior.
  if (/\.[a-z0-9]+$/i.test(target.pathname) && !target.pathname.endsWith('.html')) return;
  if (reduced.matches) return;
  event.preventDefault();
  if (navigating) return;
  navigating = true;
  const panels = createDoors();
  gsap.set(panels, { xPercent: (index: number) => index === 0 ? -100 : 100 });
  departure = animateDoors(panels, false, () => location.assign(target.href));
});

const initialPanels = ['pre-door-left', 'pre-door-right'].map(id => document.getElementById(id));
if (initialPanels.every((panel): panel is HTMLElement => panel !== null)) {
  // The page is already painted under the doors; no whole-page opacity fade.
  requestAnimationFrame(() => animateDoors(initialPanels, true));
}
