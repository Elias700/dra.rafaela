import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { DUR, EASE, STAGGER, ScrollAnimationService } from './scroll-animation.service';

/**
 * Etapas fixadas com troca de conteúdo — combinação de A14 (sticky + scrub),
 * A35 (tabs com máscara) e A36 (indicador deslizante). Só desktop e sem reduced-motion.
 *
 * Estrutura: [appStepScene] > [data-step-stage] > ([data-step-tab]*, [data-step-indicator], [data-step-panel]* > [data-step-art])
 *
 * No mobile/reduced-motion as etapas ficam empilhadas (CSS sem .is-steps) com reveal simples.
 * Todo o texto das etapas fica no DOM o tempo todo (leitores de tela e SEO).
 */
@Directive({ selector: '[appStepScene]' })
export class StepSceneDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, ScrollTrigger }, c) => {
        const panels = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-step-panel]'));
        const tabs = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-step-tab]'));
        const indicator = el.querySelector<HTMLElement>('[data-step-indicator]');
        if (!panels.length) return;

        if (c.reduce) return;

        if (!c.pin) {
          panels.forEach((panel) =>
            gsap.from(panel.children, {
              autoAlpha: 0,
              y: '1.5rem',
              duration: DUR.l,
              stagger: STAGGER,
              scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
            }),
          );
          return;
        }

        el.classList.add('is-steps');
        const n = panels.length;
        let current = 0;

        gsap.set(panels, { autoAlpha: 0 });
        gsap.set(panels[0], { autoAlpha: 1 });
        tabs[0]?.classList.add('is-active');
        if (indicator && tabs[0])
          gsap.set(indicator, { height: tabs[0].offsetHeight, y: tabs[0].offsetTop });

        const go = (next: number) => {
          const prev = panels[current];
          const panel = panels[next];
          const dir = next > current ? 1 : -1;
          tabs[current]?.classList.remove('is-active');
          tabs[next]?.classList.add('is-active');
          current = next;

          gsap.to(prev, {
            autoAlpha: 0,
            y: `${-1 * dir}rem`,
            duration: DUR.s,
            ease: EASE.in,
            overwrite: true,
          });
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: `${1.5 * dir}rem` },
            { autoAlpha: 1, y: 0, duration: DUR.m, delay: 0.15, ease: EASE.out, overwrite: true },
          );
          const art = panel.querySelector<HTMLElement>('[data-step-art]');
          if (art) {
            gsap.fromTo(
              art,
              { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
              {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                duration: DUR.l,
                delay: 0.1,
                ease: EASE.inOut,
                overwrite: true,
              },
            );
          }
          const tab = tabs[next];
          if (indicator && tab) {
            // Só transform (no clone o realce anima y + height).
            gsap.to(indicator, {
              y: tab.offsetTop,
              duration: DUR.m,
              ease: EASE.inOut,
              overwrite: true,
            });
          }
        };

        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const next = Math.min(n - 1, Math.floor(self.progress * n));
            if (next !== current) go(next);
          },
        });

        return () => {
          el.classList.remove('is-steps');
          tabs.forEach((t) => t.classList.remove('is-active'));
        };
      }),
    );
  }
}
