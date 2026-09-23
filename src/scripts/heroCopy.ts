/** Reveal letters in reading order without replacing text or changing line breaks. */
export function revealHeroCopy(element: Element | null) {
  if (!element) return () => {};
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return () => {};
  const animations: Animation[] = [];
  let index = 0;
  element.querySelectorAll('.typing-line').forEach(line => {
    const fragment = document.createDocumentFragment();
    for (const char of line.textContent ?? '') {
      const span = document.createElement('span');
      span.className = 'typing-letter';
      span.textContent = char === ' ' ? '\u00a0' : char;
      fragment.appendChild(span);
    }
    line.replaceChildren(fragment);
    line.querySelectorAll<HTMLElement>('.typing-letter').forEach(span => {
      animations.push(span.animate([
        { opacity: 0, transform: 'translateY(0.16em)', filter: 'blur(3px)' },
        { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
      ], { duration: 360, delay: 180 + index++ * 27, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'backwards' }));
    });
  });
  const stop = () => animations.forEach(animation => animation.cancel());
  const onPreference = () => { if (preference.matches) stop(); };
  preference.addEventListener('change', onPreference);
  return () => { stop(); preference.removeEventListener('change', onPreference); };
}
