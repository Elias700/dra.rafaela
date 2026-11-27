import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { FAQ, FAQ_INTRO } from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/**
 * Dúvidas frequentes — acordeão do clone (A37): ícone gira, conteúdo abre com transição
 * (grid-template-rows, sem medir altura em JS) e texto sobe. Vários itens podem ficar
 * abertos (melhor para acessibilidade). O schema FAQPage é gerado pelo SeoService.
 */
@Component({
  selector: 'app-faq',
  imports: [Icon, RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly anim = inject(ScrollAnimationService);
  protected readonly intro = FAQ_INTRO;
  protected readonly items = FAQ;
  protected readonly open = signal<ReadonlySet<number>>(new Set());

  protected toggle(i: number): void {
    this.open.update((set) => {
      const next = new Set(set);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    // A altura da página muda: recalcula os gatilhos depois da transição.
    this.anim.scheduleRefresh(900);
  }
}
