import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { DUR, EASE, ScrollAnimationService } from './scroll-animation.service';

/**
 * Selo circular girando (A28): gira devagar e acelera de leve conforme a velocidade do
 * scroll, voltando ao ritmo normal em seguida. Só roda enquanto está visível.
 * No clone: 30°/s; aqui 12°/s.
 */
@Directive({ selector: '[appSpinBadge]' })
export class SpinBadgeDirective {
  readonly appSpinBadge = input<number | ''>(12);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, ScrollTrigger }, c) => {
        if (c.reduce) return;
        const base = Number(this.appSpinBadge()) || 12;
        const state = { speed: base, dir: 1 };
        let rotation = 0;
        let settle: ReturnType<typeof setTimeout> | undefined;

        const tick = (_t: number, dt: number) => {
          rotation += state.speed * (Math.min(dt, 100) / 1000);
          gsap.set(el, { rotation });
        };
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        });
        if (st.isActive) gsap.ticker.add(tick);

        const off = anim.onScroll((velocity) => {
          if (velocity !== 0) state.dir = velocity > 0 ? 1 : -1;
          gsap.to(state, {
            speed: state.dir * (base + 4 * Math.min(Math.abs(velocity), 10)),
            duration: 0.3,
            ease: EASE.out,
            overwrite: true,
          });
          clearTimeout(settle);
          settle = setTimeout(
            () => gsap.to(state, { speed: base * state.dir, duration: DUR.l, ease: EASE.out }),
            120,
          );
        });

        return () => {
          gsap.ticker.remove(tick);
          clearTimeout(settle);
          off();
        };
      }),
    );
  }
}
