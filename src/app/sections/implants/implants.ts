import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ArchWindowDirective } from '../../core/animations/arch-window.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { StepSceneDirective } from '../../core/animations/step-scene.directive';
import { IMPLANTS, treatmentMessage, whatsappUrl } from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';
import { ImplantArt } from './implant-art';

/**
 * Implantes (destaque) — A16 (janela em arco que se abre) + etapas fixadas
 * (A14 sticky/scrub + A35 troca com máscara + A36 indicador deslizante + A3/A39 números).
 */
@Component({
  selector: 'app-implants',
  imports: [Icon, ImplantArt, ArchWindowDirective, StepSceneDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './implants.html',
  styleUrl: './implants.scss',
})
export class Implants {
  private readonly anim = inject(ScrollAnimationService);
  protected readonly implants = IMPLANTS;
  protected readonly whatsapp = whatsappUrl(treatmentMessage('implantes dentários'));

  protected goTo(event: MouseEvent, id: string): void {
    if (this.anim.scrollToId(id)) event.preventDefault();
  }
}
