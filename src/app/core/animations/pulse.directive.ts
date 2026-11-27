import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Pulso do marcador de localização (A38). No clone anima width/height; aqui só
 * `scale`/`opacity`, e pausa fora da tela. Parado com reduced-motion.
 * Estrutura: [appPulse] > [data-pulse-ring]*
 */
@Directive({ selector: '[appPulse]' })
export class PulseDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        if (c.reduce) return;
        const rings = el.querySelectorAll('[data-pulse-ring]');
        gsap.fromTo(
          rings,
          { scale: 1, autoAlpha: 0.55 },
          {
            scale: 2.2,
            autoAlpha: 0,
            duration: 2.4,
            ease: 'sine.out',
            stagger: { each: 0.8, repeat: -1 },
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              toggleActions: 'play pause resume pause',
            },
          },
        );
      }),
    );
  }
}
