import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Troca de tema do header fixo (A23): quando a linha central do header está sobre uma
 * seção `[data-bg="dark"]`, o header recebe `.is-on-dark`. Também marca `.is-scrolled`
 * depois do topo (fundo translúcido para legibilidade).
 */
@Directive({ selector: '[appHeaderTheme]' })
export class HeaderThemeDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ ScrollTrigger }) => {
        const active = new Set<Element>();
        const mid = () => el.offsetHeight / 2;
        const sync = () => el.classList.toggle('is-on-dark', active.size > 0);

        document.querySelectorAll('[data-bg="dark"]').forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: () => `top top+=${mid()}`,
            end: () => `bottom top+=${mid()}`,
            onToggle: (self) => {
              if (self.isActive) active.add(section);
              else active.delete(section);
              sync();
            },
          });
        });

        ScrollTrigger.create({
          start: 40,
          end: 'max',
          // progress (e não isActive): no fim da página o gatilho deixa de estar ativo.
          onToggle: (self) => el.classList.toggle('is-scrolled', self.progress > 0),
        });

        return () => el.classList.remove('is-on-dark', 'is-scrolled');
      }),
    );
  }
}
