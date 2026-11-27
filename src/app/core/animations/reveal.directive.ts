import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { DUR, STAGGER, ScrollAnimationService } from './scroll-animation.service';

export type RevealType = 'ctn' | 'line' | 'line-x' | 'fade';

/**
 * Reveals de bloco do clone (A6 `ctn`, A7 `line`), disparados uma vez ao entrar na tela.
 * Com `revealChildren`, anima os filhos que casam com o seletor, em sequência (stagger).
 *
 * Uso: <ul appReveal revealChildren="li"> · <span appReveal="line">
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<RevealType | ''>('ctn');
  readonly revealChildren = input<string | null>(null);
  readonly revealDelay = input(0);
  readonly revealStart = input('top 88%');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        const selector = this.revealChildren();
        const targets = selector
          ? gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector))
          : [el];
        if (!targets.length) return;
        const scrollTrigger = { trigger: el, start: this.revealStart(), once: true };
        const delay = this.revealDelay();
        const type = this.appReveal() || 'ctn';

        if (c.reduce) {
          gsap.from(targets, { autoAlpha: 0, duration: DUR.s, ease: 'none', delay, scrollTrigger });
          return;
        }

        switch (type) {
          case 'ctn':
            gsap.from(targets, {
              autoAlpha: 0,
              y: c.desktop ? '2rem' : '1.5rem',
              duration: DUR.l,
              delay,
              stagger: STAGGER,
              clearProps: 'transform,opacity,visibility',
              scrollTrigger,
            });
            break;
          case 'line':
            gsap.from(targets, {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: DUR.l * 1.4,
              delay,
              stagger: STAGGER,
              clearProps: 'clipPath',
              scrollTrigger,
            });
            break;
          case 'line-x':
            gsap.from(targets, {
              clipPath: 'inset(0% 100% 0% 0%)',
              duration: DUR.l * 1.4,
              delay,
              stagger: STAGGER,
              clearProps: 'clipPath',
              scrollTrigger,
            });
            break;
          case 'fade':
            gsap.from(targets, {
              autoAlpha: 0,
              duration: DUR.l,
              delay,
              stagger: STAGGER,
              scrollTrigger,
            });
            break;
        }
      }),
    );
  }
}
