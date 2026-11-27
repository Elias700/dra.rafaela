import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Cenas com scrub portadas do clone:
 * - `card-in` (A19): o card se aproxima (scale .92 → 1, opacidade) ao entrar.
 * - `settle` (A20): fundo/foto “assenta” (scale 1.08 → 1) enquanto a seção entra.
 * - `exit` (A17, zoom-through): o conteúdo cresce levemente e esmaece ao sair por cima (só desktop).
 */
@Directive({ selector: '[appScrollScene]' })
export class ScrollSceneDirective {
  readonly appScrollScene = input.required<'card-in' | 'settle' | 'exit'>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        if (c.reduce) return;
        const section = (el.closest('section') as HTMLElement | null) ?? el;

        switch (this.appScrollScene()) {
          case 'card-in':
            gsap.fromTo(
              el,
              { scale: c.desktop ? 0.92 : 0.96, y: '3rem' },
              {
                scale: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 50%', scrub: 0.5 },
              },
            );
            break;
          case 'settle':
            gsap.fromTo(
              el,
              { scale: 1.08, transformOrigin: '50% 100%' },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom bottom',
                  scrub: 0.25,
                },
              },
            );
            break;
          case 'exit':
            if (!c.desktop) return;
            gsap.fromTo(
              el,
              { scale: 1, autoAlpha: 1 },
              {
                scale: 1.06,
                autoAlpha: 0.1,
                ease: 'rcIn',
                scrollTrigger: {
                  trigger: section,
                  start: 'bottom 65%',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
            break;
        }
      }),
    );
  }
}
