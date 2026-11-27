import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ScrollAnimationService } from './scroll-animation.service';

/**
 * Título cujas palavras se aproximam ao rolar — releitura de A15 (no clone, `word-spacing`
 * 0 → 10rem). Aqui as palavras começam afastadas do centro e se encontram (metáfora de
 * acolhimento), animando só `transform`/`opacity` (word-spacing causaria reflow).
 */
@Directive({ selector: '[appSpreadWords]' })
export class SpreadWordsDirective {
  /** Deslocamento máximo em px no desktop (mobile usa ~40%). */
  readonly appSpreadWords = input<number | ''>(180);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, SplitText }, c) => {
        if (c.reduce) return;
        const amount = (Number(this.appSpreadWords()) || 180) * (c.desktop ? 1 : 0.4);
        gsap.set(el, { position: 'relative' });

        SplitText.create(el, {
          type: 'words',
          wordsClass: 'split-word',
          aria: 'auto',
          autoSplit: true,
          onSplit: (self) => {
            const offset = (word: HTMLElement) => {
              const center = word.offsetLeft + word.offsetWidth / 2;
              return ((center - el.clientWidth / 2) / (el.clientWidth / 2)) * amount;
            };
            return gsap.fromTo(
              self.words,
              { x: (_i: number, w: HTMLElement) => offset(w) },
              {
                x: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top bottom',
                  end: 'center 55%',
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          },
        });
      }),
    );
  }
}
