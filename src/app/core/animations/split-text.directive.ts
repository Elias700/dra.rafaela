import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { DUR, EASE, STAGGER, ScrollAnimationService } from './scroll-animation.service';

/**
 * Reveals de texto do clone com SplitText:
 * - `p` (A5): linhas com máscara sobem (yPercent 110 → 0). Igual ao clone.
 * - `h` (A4): palavras sobem dentro de uma máscara. No clone são letras com rotateY;
 *   por palavra fica mais calmo e com ~3× menos nós no DOM.
 * - `a` (A3): letras giram em X e deslizam. Distâncias reduzidas (10rem → 1.5rem).
 *
 * Acessibilidade: em `h`/`a` o SplitText coloca aria-label no elemento (use em headings);
 * em parágrafos use `splitAria="none"` (linhas mantêm palavras inteiras).
 */
@Directive({ selector: '[appSplitText]' })
export class SplitTextDirective {
  readonly appSplitText = input<'a' | 'h' | 'p' | ''>('h');
  readonly splitDelay = input(0);
  readonly splitStart = input('top 85%');
  readonly splitAria = input<'auto' | 'none'>('auto');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      anim.attach(el, destroyRef, ({ gsap, SplitText }, c) => {
        const scrollTrigger = { trigger: el, start: this.splitStart(), once: true };
        const delay = this.splitDelay();
        const variant = this.appSplitText() || 'h';

        if (c.reduce) {
          gsap.from(el, { autoAlpha: 0, duration: DUR.s, ease: 'none', delay, scrollTrigger });
          return;
        }

        if (variant === 'p') {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            aria: 'none',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: DUR.l,
                stagger: STAGGER,
                delay,
                scrollTrigger,
              }),
          });
          return;
        }

        if (variant === 'h') {
          // Títulos: palavras sobem dentro de uma máscara (no clone: letras com rotateY).
          // Por palavra = ~3× menos nós no DOM e movimento mais calmo.
          SplitText.create(el, {
            type: 'words',
            mask: 'words',
            wordsClass: 'split-word',
            aria: this.splitAria() === 'auto' ? 'auto' : 'none',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 105,
                duration: DUR.l,
                stagger: 0.05,
                delay,
                scrollTrigger,
              }),
          });
          return;
        }

        SplitText.create(el, {
          type: 'words,chars',
          wordsClass: 'split-word',
          charsClass: 'split-char',
          aria: this.splitAria() === 'auto' ? 'auto' : 'none',
          autoSplit: true,
          onSplit: (self) => {
            const amount = Math.min(0.6, self.chars.length * 0.02);
            gsap.set(el, { perspective: 800 });
            return gsap.from(self.chars, {
              autoAlpha: 0,
              rotateX: 45,
              x: '1.5rem',
              transformOrigin: '50% 100%',
              duration: DUR.l,
              ease: EASE.out,
              stagger: { amount },
              delay,
              scrollTrigger,
            });
          },
        });
      }),
    );
  }
}
