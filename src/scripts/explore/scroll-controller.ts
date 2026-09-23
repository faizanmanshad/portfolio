import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initExploreScroll() {
  if (typeof window === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global scrub duration for buttery smoothness
  const SMOOTH_SCRUB = 1.5;

  const ctx = gsap.context(() => {
    
    // 1. Fade supporting copy; the 3D name owns its own reversible motion.
    const heroContent = document.querySelector('.hero-bottom');
    if (heroContent && !isReducedMotion) {
      gsap.to(heroContent, {
        scrollTrigger: {
          trigger: '.section-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: SMOOTH_SCRUB,
        },
        y: 200,
        scale: 0.85,
        opacity: 0,
        ease: 'power1.inOut' // Smoother transition into the depth
      });
    }

    // 2. Portal Dimensional Transition
    if (!isReducedMotion) {
      const portals = document.querySelectorAll('.explore-portal');
      
      portals.forEach((portal) => {
        const svgContainer = portal.querySelector('.portal-svg-container');
        const linesGroup = portal.querySelector('.portal-lines');
        const text = portal.querySelector('.portal-text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: portal,
            start: 'top top',
            end: 'bottom bottom',
            scrub: SMOOTH_SCRUB,
          }
        });

        tl.to(svgContainer, { opacity: 1, duration: 0.1 });
        
        // Slower ease into the grid
        tl.to(linesGroup, {
          scale: 15,
          transformOrigin: '50% 50%',
          ease: 'power2.inOut',
          duration: 0.8
        }, 0);

        tl.to(text, { opacity: 1, duration: 0.2 }, 0.2);
        tl.to(text, { opacity: 0, scale: 2, duration: 0.2 }, 0.7);
        
        tl.to(svgContainer, { opacity: 0, duration: 0.1 }, 0.9);
      });
    }

    // 3. Chapter and Project Field Entrance
    const chapters = document.querySelectorAll('.explore-chapter');
    chapters.forEach((chapter) => {
      const header = chapter.querySelector('.chapter-header');
      const items = chapter.querySelectorAll('.spatial-project');

      if (!isReducedMotion && header) {
        gsap.fromTo(header, 
          { opacity: 0, y: 100 },
          {
            scrollTrigger: {
              trigger: chapter,
              start: 'top 85%',
              end: 'top 35%',
              scrub: SMOOTH_SCRUB
            },
            opacity: 1,
            y: 0,
            ease: 'power2.out'
          }
        );

        items.forEach((item, index) => {
          const yOffset = 150 + (index * 50);
          
          // 1. Entrance animation
          gsap.fromTo(item,
            { opacity: 0, y: yOffset },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top 95%',
                end: 'top 40%',
                scrub: SMOOTH_SCRUB
              },
              opacity: 1,
              y: 0,
              ease: 'power2.out'
            }
          );

          // 2. Continuous Curved Cylinder Scroll Physics
          // Animates the rotationX from 30deg (bottom curve) to -30deg (top curve) as it crosses the viewport
          gsap.fromTo(item,
            { rotationX: 45, transformOrigin: 'center center -200px' },
            {
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              },
              rotationX: -45,
              ease: 'none'
            }
          );
        });
      }
    });

    // 4. Finale Sequence
    const finale = document.querySelector('.explore-finale');
    if (finale && !isReducedMotion) {
      const nodes = finale.querySelectorAll('.constellation-node');
      const text = finale.querySelector('.gsap-finale-text');
      const links = finale.querySelector('.gsap-finale-links');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: finale,
          start: 'top 80%',
          end: 'top 20%',
          scrub: SMOOTH_SCRUB
        }
      });

      tl.fromTo(nodes, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 0.8, stagger: 0.05, duration: 1, ease: 'back.out(1.7)' }
      );
      
      tl.fromTo(text,
        { opacity: 0, y: 100, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
        0.5
      );

      tl.fromTo(links,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.8
      );
    }

    // 5. Hover Image Reveal (Awwwards Style)
    const hoverImg = document.querySelector('.hover-reveal-img') as HTMLElement;
    const projectItems = document.querySelectorAll('.spatial-project');

    if (hoverImg && projectItems.length > 0 && !isReducedMotion) {
      gsap.set(hoverImg, { opacity: 0, scale: 0.8 });

      // Move image with mouse globally
      const onMouseMove = (e: MouseEvent) => {
        gsap.to(hoverImg, {
          x: e.clientX - 150, // center offset
          y: e.clientY - 200, // center offset
          duration: 0.4,
          ease: 'power3.out'
        });
      };
      
      document.addEventListener('mousemove', onMouseMove);

      projectItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          const imgUrl = item.getAttribute('data-image');
          if (imgUrl) {
            hoverImg.style.backgroundImage = `url('${imgUrl}')`;
            hoverImg.style.backgroundSize = 'cover';
            hoverImg.style.backgroundPosition = 'center';
            gsap.to(hoverImg, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power3.out'
            });
          }
        });

        item.addEventListener('mouseleave', () => {
          gsap.to(hoverImg, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power3.out'
          });
        });
      });
      
      // Cleanup for context
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
      };
    }

  });

  return ctx;
}
