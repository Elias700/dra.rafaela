import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Botão magnético (A26): segue levemente o cursor. Só com ponteiro preciso, desktop e
 * sem reduced-motion. Força menor que a do clone (25 → 12) e retorno sem elástico.
 */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  readonly appMagnetic = input<number | ''>(12);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        if (!c.fine || !c.desktop || c.reduce) return;
        const strength = Number(this.appMagnetic()) || 12;
        const xTo = gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' });

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * strength);
          yTo(((e.clientY - r.top) / r.height - 0.5) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      }),
    );
  }
}
