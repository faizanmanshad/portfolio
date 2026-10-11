import { gsap } from 'gsap';

export function createDoors() {
  return ['left', 'right'].map((side) => {
    const panel = document.createElement('div');
    panel.dataset.pageDoor = 'true';
    panel.style.cssText = `position:fixed;top:0;bottom:0;${side}:0;width:50vw;z-index:2147483647;pointer-events:none;will-change:transform;background:linear-gradient(to ${side === 'left' ? 'right' : 'left'},#101412 70%,#2a1008 100%);`;
    document.body.appendChild(panel);
    return panel;
  });
}

export function animateDoors(panels: HTMLElement[], open: boolean, complete?: () => void) {
  return gsap.to(panels, {
    xPercent: (index: number) => open ? (index === 0 ? -100 : 100) : 0,
    duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.5,
    ease: 'power3.inOut',
    overwrite: true,
    onComplete: () => {
      if (open) panels.forEach(panel => panel.remove());
      complete?.();
    },
  });
}
