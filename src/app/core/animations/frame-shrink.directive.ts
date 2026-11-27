import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Moldura que encolhe (A21, “footer clip” do clone): um painel em tela cheia
 * (`[data-frame]`) se recolhe com clip-path até o contorno do conteúdo
 * (`[data-frame-content]`), que aparece crescendo de .94 → 1.
 * Sem JS fica em tela cheia; com reduced-motion já aparece como card.
 */
@Directive({ selector: '[appFrameShrink]' })
export class FrameShrinkDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap }, c) => {
        const frame = el.querySelector<HTMLElement>('[data-frame]');
        const content = el.querySelector<HTMLElement>('[data-frame-content]');
        if (!frame || !content) return;

        const radius = c.desktop ? 32 : 20;
        const finalInset = () => {
          const top = content.offsetTop;
          const left = content.offsetLeft;
          const right = el.clientWidth - (left + content.offsetWidth);
          const bottom = el.clientHeight - (top + content.offsetHeight);
          return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
        };

        if (c.reduce) {
          gsap.set(frame, { clipPath: finalInset() });
          return;
        }

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 15%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            frame,
            { clipPath: 'inset(0px 0px 0px 0px round 0px)' },
            { clipPath: () => finalInset() },
            0,
          )
          .fromTo(content, { scale: 0.94 }, { scale: 1 }, 0);
      }),
    );
  }
}
