import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { CONTACT } from '../../core/data/site-content';
import { TESTIMONIALS, TESTIMONIALS_CONFIG } from '../../core/data/testimonials';
import { Icon } from '../../shared/icon/icon';

/**
 * Depoimentos — slider com autoplay e barra de progresso (A34) e botões com arco (A27).
 * Acessível: botão de pausa, setas, teclado (← →), swipe, pausa com foco/hover,
 * aria-live desligado durante o autoplay. Autoplay desligado com reduced-motion.
 * O avanço é sincronizado com o fim da animação CSS da barra de progresso.
 */
@Component({
  selector: 'app-testimonials',
  imports: [Icon, RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  protected readonly config = TESTIMONIALS_CONFIG;
  protected readonly items = TESTIMONIALS;
  protected readonly googleUrl = CONTACT.googleProfileUrl;

  protected readonly index = signal(0);
  /** Preferência do usuário (botão pausar/reproduzir). Começa desligado no SSR. */
  protected readonly autoplay = signal(false);
  private readonly inView = signal(false);
  private readonly interacting = signal(false);
  protected readonly running = computed(
    () => this.autoplay() && this.inView() && !this.interacting(),
  );
  /** Muda a cada troca de slide para reiniciar a animação da barra. */
  protected readonly cycle = computed(() => [this.index()]);
  private pointerStartX: number | null = null;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.autoplay.set(!reduce);
      const io = new IntersectionObserver(([entry]) => this.inView.set(entry.isIntersecting), {
        threshold: 0.3,
      });
      io.observe(host);
      const onVisibility = () => this.inView.set(!document.hidden && this.isOnScreen(host));
      document.addEventListener('visibilitychange', onVisibility);
      destroyRef.onDestroy(() => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  protected next(): void {
    this.index.update((i) => (i + 1) % this.items.length);
  }

  protected prev(): void {
    this.index.update((i) => (i - 1 + this.items.length) % this.items.length);
  }

  protected toggleAutoplay(): void {
    this.autoplay.update((v) => !v);
  }

  protected setInteracting(value: boolean): void {
    this.interacting.set(value);
  }

  protected onFocusOut(event: FocusEvent): void {
    const current = event.currentTarget as HTMLElement;
    if (!current.contains(event.relatedTarget as Node | null)) this.interacting.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse') return;
    this.pointerStartX = event.clientX;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) return;
    const dx = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (Math.abs(dx) < 50) return;
    this.autoplay.set(false); // interação manual pausa o autoplay
    if (dx < 0) this.next();
    else this.prev();
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  private isOnScreen(el: HTMLElement): boolean {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
}
