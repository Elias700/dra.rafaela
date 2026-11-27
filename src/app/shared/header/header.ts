import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HeaderThemeDirective } from '../../core/animations/header-theme.directive';
import { MagneticDirective } from '../../core/animations/magnetic.directive';
import { NavHoverDirective } from '../../core/animations/nav-hover.directive';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { CONTACT, DENTIST, HERO, NAV, whatsappUrl } from '../../core/data/site-content';
import { Icon } from '../icon/icon';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-header',
  imports: [Logo, Icon, NavHoverDirective, MagneticDirective],
  hostDirectives: [HeaderThemeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'site-header',
    '[class.is-open]': 'open()',
    '(document:keydown.escape)': 'close(true)',
  },
})
export class Header {
  private readonly anim = inject(ScrollAnimationService);
  private readonly document = inject(DOCUMENT);
  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  protected readonly nav = NAV;
  protected readonly cro = `${DENTIST.name} · ${DENTIST.cro}`;
  protected readonly ctaLabel = HERO.primaryCta;
  protected readonly ctaHref = whatsappUrl() ?? '/#contato';
  protected readonly ctaIsWhatsapp = CONTACT.whatsapp !== null;
  protected readonly open = signal(false);
  private hydrated = false;

  constructor() {
    afterNextRender(() => (this.hydrated = true));
  }

  protected toggle(): void {
    if (this.open()) this.close(true);
    else this.openMenu();
  }

  protected go(event: MouseEvent, id: string): void {
    // Sem JS hidratado, ou fora da home (seção inexistente), o link /#id navega normalmente.
    if (!this.hydrated || !this.document.getElementById(id)) return;
    event.preventDefault();
    this.close(false);
    // Espera o menu liberar o scroll antes de rolar.
    setTimeout(() => this.anim.scrollToId(id), 10);
  }

  protected goTop(event: MouseEvent): void {
    this.go(event, 'inicio');
  }

  protected onCta(event: MouseEvent): void {
    if (!this.ctaIsWhatsapp) this.go(event, 'contato');
    else this.close(false);
  }

  close(returnFocus: boolean): void {
    if (!this.open()) return;
    this.open.set(false);
    this.setPageInert(false);
    this.anim.startScroll();
    this.document.documentElement.classList.remove('menu-open');
    if (returnFocus) this.menuButton().nativeElement.focus();
  }

  /** Trap de foco dentro do painel do menu (Tab / Shift+Tab). */
  protected trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const focusables = Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    focusables.unshift(this.menuButton().nativeElement);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private openMenu(): void {
    this.open.set(true);
    this.setPageInert(true);
    this.anim.stopScroll();
    this.document.documentElement.classList.add('menu-open');
    setTimeout(() => this.panel().nativeElement.querySelector<HTMLElement>('a')?.focus(), 60);
  }

  private setPageInert(inert: boolean): void {
    this.document.querySelectorAll('main, footer, .skip-link').forEach((el) => {
      (el as HTMLElement).inert = inert;
    });
  }
}
