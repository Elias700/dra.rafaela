import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { whatsappUrl } from '../../core/data/site-content';
import { Icon } from '../icon/icon';

/**
 * Botão flutuante de WhatsApp: aparece depois que o hero sai da tela.
 * Arco no hover = A27 (btn-circle do clone), em CSS.
 * Sempre visível. Enquanto CONTACT.whatsapp (site-content.ts) estiver vazio, leva ao
 * formulário de contato; com o número preenchido, abre o WhatsApp.
 */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './whatsapp-fab.scss',
  template: `
    <a
      class="fab"
      [class.is-visible]="visible()"
      [href]="href ?? '/#contato'"
      [attr.target]="href ? '_blank' : null"
      [attr.rel]="href ? 'noopener' : null"
      [attr.tabindex]="visible() ? null : -1"
      [attr.aria-hidden]="visible() ? null : 'true'"
      (click)="onClick($event)"
    >
      <svg class="fab__arc" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30.5" pathLength="100" />
      </svg>
      <app-icon name="whatsapp" />
      <span class="visually-hidden">{{ label }}</span>
    </a>
  `,
})
export class WhatsappFab {
  protected readonly href = whatsappUrl();
  protected readonly visible = signal(false);
  protected readonly label = this.href
    ? 'Agendar avaliação pelo WhatsApp (abre em nova aba)'
    : 'Agendar avaliação (ir para o contato)';
  private readonly anim = inject(ScrollAnimationService);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const hero = document.getElementById('inicio');
      if (!hero) return;
      const io = new IntersectionObserver(([entry]) => this.visible.set(!entry.isIntersecting), {
        rootMargin: '0px 0px -40% 0px',
      });
      io.observe(hero);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  protected onClick(event: MouseEvent): void {
    if (!this.href && this.anim.scrollToId('contato')) event.preventDefault();
  }
}
