import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { EASE, ScrollAnimationService } from './scroll-animation.service';

/**
 * “Janela que se abre” (A16), só desktop e sem reduced-motion.
 *
 * Duas folhas na cor do fundo claro, com um recorte em arco no centro, cobrem o palco escuro.
 * Ao rolar, elas se afastam (só transform) e o conteúdo do palco cresce de .88 → 1.
 * No clone isso é feito animando clip-path de polígonos; aqui o recorte é estático (CSS)
 * e só `transform` é animado.
 *
 * Estrutura: [appArchWindow] > [data-arch-stage] > ([data-arch-content] > [data-arch-item]*, [data-arch-panel] ×2)
 */
@Directive({ selector: '[appArchWindow]' })
export class ArchWindowDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        const content = el.querySelector<HTMLElement>('[data-arch-content]');
        const itemsSel = el.querySelectorAll<HTMLElement>('[data-arch-item]');

        if (!c.pin || c.reduce) {
          if (c.reduce) return;
          gsap.from(itemsSel, {
            autoAlpha: 0,
            y: '1.5rem',
            duration: 1.2,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          });
          return;
        }

        el.classList.add('is-arch');
        const [left, right] = gsap.utils.toArray<HTMLElement>(
          el.querySelectorAll('[data-arch-panel]'),
        );
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
        });

        // 1) o título aparece dentro do arco; 2) as folhas se afastam; 3) respiro antes de soltar.
        tl.from(itemsSel, { autoAlpha: 0, y: '2rem', stagger: 0.04, duration: 0.2 }, 0)
          .to(left, { xPercent: -101, duration: 0.55, ease: EASE.inOut }, 0.2)
          .to(right, { xPercent: 101, duration: 0.55, ease: EASE.inOut }, 0.2);
        if (content) tl.fromTo(content, { scale: 0.86 }, { scale: 1, duration: 0.75 }, 0);
        tl.to({}, { duration: 0.2 });

        return () => el.classList.remove('is-arch');
      }),
    );
  }
}
