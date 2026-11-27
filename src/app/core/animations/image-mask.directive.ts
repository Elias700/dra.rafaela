import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { DUR, EASE, ScrollAnimationService } from './scroll-animation.service';

/**
 * Máscara de imagem do clone (A8 `slide`, A18 `inset`):
 * - `diagonal`: o wrapper abre com um clip-path diagonal, enquanto o filho desce de escala 1.15 → 1
 *   (no clone: 1.5, mais brusco).
 * - `inset-x`: abre da esquerda para a direita.
 */
@Directive({ selector: '[appImageMask]' })
export class ImageMaskDirective {
  readonly appImageMask = input<'diagonal' | 'inset-x' | ''>('diagonal');
  readonly maskStart = input('top 85%');
  readonly maskDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        const scrollTrigger = { trigger: el, start: this.maskStart(), once: true };
        const delay = this.maskDelay();
        if (c.reduce) {
          gsap.from(el, { autoAlpha: 0, duration: DUR.s, ease: 'none', delay, scrollTrigger });
          return;
        }

        const inner = el.firstElementChild as HTMLElement | null;
        const tl = gsap.timeline({ delay, scrollTrigger });

        if ((this.appImageMask() || 'diagonal') === 'diagonal') {
          tl.fromTo(
            el,
            { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              duration: DUR.l * 1.15,
              ease: EASE.inOut,
              clearProps: 'clipPath',
            },
          );
          if (inner) {
            tl.fromTo(
              inner,
              { scale: 1.15, xPercent: 8 },
              {
                scale: 1,
                xPercent: 0,
                duration: DUR.l * 1.15,
                ease: EASE.inOut,
                clearProps: 'transform',
              },
              '<',
            );
          }
        } else {
          tl.fromTo(
            el,
            { clipPath: 'inset(0% 100% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: DUR.l * 1.4,
              ease: EASE.out,
              clearProps: 'clipPath',
            },
          );
        }
      }),
    );
  }
}
