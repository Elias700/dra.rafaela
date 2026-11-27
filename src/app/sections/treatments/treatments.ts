import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HorizontalScrollDirective } from '../../core/animations/horizontal-scroll.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import {
  TREATMENTS,
  TREATMENTS_INTRO,
  treatmentMessage,
  whatsappUrl,
} from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/**
 * Tratamentos — A18 (scroll horizontal no desktop, com reveals via containerAnimation e deriva
 * do título). Mobile/tablet: cards empilhados com reveal.
 */
@Component({
  selector: 'app-treatments',
  imports: [Icon, HorizontalScrollDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './treatments.html',
  styleUrl: './treatments.scss',
})
export class Treatments {
  private readonly anim = inject(ScrollAnimationService);
  protected readonly intro = TREATMENTS_INTRO;
  protected readonly items = TREATMENTS.map((t) => ({
    ...t,
    whatsapp: whatsappUrl(treatmentMessage(t.shortName)),
  }));
  protected readonly generalWhatsapp = whatsappUrl();

  protected goTo(event: MouseEvent, href: string): void {
    if (!href.startsWith('#')) return;
    if (this.anim.scrollToId(href.slice(1))) event.preventDefault();
  }
}
