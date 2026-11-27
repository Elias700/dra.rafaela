import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { DUR, EASE, STAGGER, ScrollAnimationService } from './scroll-animation.service';

/**
 * Hover dos itens de navegação (A24): dois rótulos empilhados; as letras do primeiro sobem
 * e as do segundo entram de baixo, com stagger proporcional à posição horizontal.
 *
 * Estrutura: <a appNavHover><span class="nav-roll"><span data-roll>Texto</span><span data-roll aria-hidden="true">Texto</span></span></a>
 */
@Directive({ selector: '[appNavHover]' })
export class NavHoverDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, SplitText }, c) => {
        if (!c.fine || c.reduce) return;
        const labels = el.querySelectorAll<HTMLElement>('[data-roll]');
        if (labels.length < 2) return;
        const a = SplitText.create(labels[0], {
          type: 'chars',
          charsClass: 'split-char',
          aria: 'none',
        });
        const b = SplitText.create(labels[1], {
          type: 'chars',
          charsClass: 'split-char',
          aria: 'none',
        });
        gsap.set(labels[1], { autoAlpha: 1 });
        gsap.set(b.chars, { yPercent: 110 });

        const stagger = { each: STAGGER * 0.3 };
        const enter = () => {
          gsap.to(a.chars, {
            yPercent: -110,
            duration: DUR.m,
            ease: EASE.ease,
            stagger,
            overwrite: true,
          });
          gsap.to(b.chars, {
            yPercent: 0,
            duration: DUR.m,
            ease: EASE.ease,
            stagger,
            overwrite: true,
          });
        };
        const leave = () => {
          gsap.to(a.chars, {
            yPercent: 0,
            duration: DUR.m,
            ease: EASE.ease,
            stagger,
            overwrite: true,
          });
          gsap.to(b.chars, {
            yPercent: 110,
            duration: DUR.m,
            ease: EASE.ease,
            stagger,
            overwrite: true,
          });
        };
        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointerleave', leave);
        };
      }),
    );
  }
}
