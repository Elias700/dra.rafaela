import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

export type ParallaxVariant = 'img' | 'img-in' | 'img-out' | 'up' | 'down';

/**
 * Parallax com scrub do clone (A10–A13), em amplitude menor.
 * - `img*`: o host é a imagem dentro de um wrapper com overflow hidden
 *   (`[data-parallax-wrap]` ou o pai). A imagem ganha uma escala que cobre o deslocamento (sem CLS).
 * - `up`/`down`: elementos decorativos.
 * Desligado com reduced-motion e, por padrão, abaixo de 992px.
 */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective {
  readonly appParallax = input<ParallaxVariant | ''>('img');
  readonly parallaxAmount = input<number | null>(null);
  readonly parallaxMobile = input(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        if (c.reduce || (c.mobile && !this.parallaxMobile())) return;
        const variant = this.appParallax() || 'img';
        const wrap =
          (el.closest('[data-parallax-wrap]') as HTMLElement | null) ?? el.parentElement ?? el;
        const a = this.parallaxAmount() ?? (variant.startsWith('img') ? 8 : 6);
        const base = { ease: 'none', force3D: true } as const;

        switch (variant) {
          case 'img':
            gsap.set(el, { scale: 1 + (a * 2.2) / 100 });
            gsap.fromTo(
              el,
              { yPercent: -a },
              {
                ...base,
                yPercent: a,
                scrollTrigger: {
                  trigger: wrap,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5,
                },
              },
            );
            break;
          case 'img-in':
            gsap.set(el, { scale: 1 + (a * 1.1) / 100 });
            gsap.fromTo(
              el,
              { yPercent: -a },
              {
                ...base,
                yPercent: 0,
                scrollTrigger: {
                  trigger: wrap,
                  start: 'top bottom',
                  end: 'bottom bottom',
                  scrub: true,
                },
              },
            );
            break;
          case 'img-out':
            gsap.fromTo(
              el,
              { yPercent: 0 },
              {
                ...base,
                yPercent: a,
                scrollTrigger: {
                  trigger: wrap,
                  start: 'bottom bottom',
                  end: 'bottom top',
                  scrub: 0.5,
                },
              },
            );
            break;
          case 'up':
          case 'down': {
            const sign = variant === 'up' ? 1 : -1;
            gsap.fromTo(
              el,
              { yPercent: a * sign },
              {
                ...base,
                yPercent: -a * sign,
                scrollTrigger: { trigger: el, start: 'top 125%', end: 'bottom -25%', scrub: 0.5 },
              },
            );
            break;
          }
        }
      }),
    );
  }
}
