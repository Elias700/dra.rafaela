import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { DUR, EASE, STAGGER, ScrollAnimationService } from './scroll-animation.service';

/**
 * Scroll horizontal do clone (A18), só desktop (≥ 992px de largura e ≥ 600px de altura) e sem reduced-motion.
 *
 * Estrutura esperada:
 *   [appHorizontalScroll]            área alta (altura calculada = distância horizontal + 1 tela)
 *     [data-hscroll-screen]          fica sticky (CSS em .is-hscroll)
 *       [data-hscroll-drift]         (opcional) linhas de título com deriva leve
 *       [data-hscroll-track]         trilho que anda em X
 *         [data-hscroll-item]        cards (reveal via containerAnimation)
 *
 * No mobile/tablet e com reduced-motion o trilho vira grade/coluna (CSS) e os cards
 * usam um reveal simples.
 */
@Directive({ selector: '[appHorizontalScroll]' })
export class HorizontalScrollDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, ScrollTrigger }, c) => {
        const track = el.querySelector<HTMLElement>('[data-hscroll-track]');
        if (!track) return;
        const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-hscroll-item]'));

        if (c.reduce) {
          gsap.from(items, {
            autoAlpha: 0,
            duration: DUR.s,
            ease: 'none',
            scrollTrigger: { trigger: track, start: 'top 85%', once: true },
          });
          return;
        }

        if (!c.pin) {
          items.forEach((item) =>
            gsap.from(item, {
              autoAlpha: 0,
              y: '1.5rem',
              duration: DUR.l,
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: item, start: 'top 90%', once: true },
            }),
          );
          return;
        }

        el.classList.add('is-hscroll');
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const setHeight = () => {
          el.style.height = `${distance() + window.innerHeight}px`;
        };
        setHeight();
        ScrollTrigger.addEventListener('refreshInit', setHeight);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: EASE.hor,
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        });

        // Cards já visíveis no início entram com um reveal normal; os demais, quando o trilho os traz.
        const firstVisible = items.filter((item) => item.offsetLeft < track.clientWidth * 0.9);
        const later = items.filter((item) => !firstVisible.includes(item));
        gsap.from(firstVisible, {
          autoAlpha: 0,
          y: '2rem',
          duration: DUR.l,
          stagger: STAGGER,
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        });
        later.forEach((item) =>
          gsap.from(item, {
            autoAlpha: 0,
            x: '4rem',
            duration: DUR.l,
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: item,
              containerAnimation: tween,
              start: 'left 95%',
              once: true,
            },
          }),
        );

        // Deriva leve das linhas de título (no clone: ±25%).
        const drift = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-hscroll-drift]'));
        if (drift.length) {
          gsap.fromTo(
            drift,
            { xPercent: gsap.utils.wrap([4, -2]) },
            {
              xPercent: gsap.utils.wrap([-4, 2]),
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.25 },
            },
          );
        }

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', setHeight);
          el.classList.remove('is-hscroll');
          el.style.height = '';
        };
      }),
    );
  }
}
