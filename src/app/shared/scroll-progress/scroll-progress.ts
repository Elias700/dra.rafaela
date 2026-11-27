import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';

/**
 * Barra de progresso vertical (A29), só desktop. Usa scaleY (no clone: variável CSS de altura).
 * Decorativa: aria-hidden.
 */
@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      position: fixed;
      left: max(1rem, calc((100vw - 90rem) / 2 - 1rem));
      top: 50%;
      z-index: 50;
      display: none;
      width: 2px;
      height: 28vh;
      margin-top: -14vh;
      background: var(--c-line);
      border-radius: 2px;
      overflow: hidden;
      mix-blend-mode: multiply;
    }
    @media (min-width: 80em) and (prefers-reduced-motion: no-preference) {
      :host {
        display: block;
      }
    }
    .thumb {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--c-gold);
      transform: scaleY(0);
      transform-origin: top;
    }
  `,
  template: `<span class="thumb"></span>`,
})
export class ScrollProgress {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const anim = inject(ScrollAnimationService);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() =>
      anim.attach(host, destroyRef, ({ gsap, ScrollTrigger }, c) => {
        if (!c.desktop || c.reduce) return;
        const thumb = host.querySelector('.thumb');
        const setY = gsap.quickSetter(thumb, 'scaleY');
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setY(self.progress) });
      }),
    );
  }
}
