import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import {
  ADDRESS,
  CLINIC,
  CONTACT,
  DENTIST,
  NAV,
  addressLine,
  cityLine,
  specialtyLabel,
} from '../../core/data/site-content';
import { Icon } from '../icon/icon';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-footer',
  imports: [Logo, Icon, RouterLink, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  host: { 'data-bg': 'dark' },
})
export class Footer {
  private readonly anim = inject(ScrollAnimationService);

  protected readonly nav = NAV;
  protected readonly clinic = CLINIC;
  protected readonly dentist = DENTIST;
  protected readonly contact = CONTACT;
  protected readonly address = ADDRESS;
  protected readonly addressLine = addressLine();
  protected readonly cityLine = cityLine();
  protected readonly specialty = specialtyLabel();
  protected readonly year = new Date().getFullYear();

  protected go(event: MouseEvent, id: string): void {
    // Na política de privacidade a seção não existe: deixa o link navegar para /#id.
    if (this.anim.scrollToId(id)) event.preventDefault();
  }
}
