import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { MagneticDirective } from '../../core/animations/magnetic.directive';
import { EASE, ScrollAnimationService } from '../../core/animations/scroll-animation.service';
import { SpinBadgeDirective } from '../../core/animations/spin-badge.directive';
import { CONTACT, DENTIST, HERO, specialtyLabel, whatsappUrl } from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/**
 * Hero.
 * - Intro (A1/A2 adaptados): arco se abre sobre a foto + palavras da frase (A3) + blocos (A6),
 *   em CSS puro, ≤ 1.2s, uma vez por sessão (classe html.intro-pending do script inline).
 * - Hero flow (A14), desktop: área alta com palco sticky; o texto sobe mais rápido que a foto
 *   e a foto cresce de leve (1 → 1.1). Mobile: só parallax `img-out` (A12).
 */
@Component({
  selector: 'app-hero',
  imports: [Icon, MagneticDirective, SpinBadgeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly hero = HERO;
  /** Palavras da frase, já separadas no HTML do SSR (a intro anima cada uma em CSS). */
  protected readonly words = [
    ...HERO.statementStart.split(' ').map((text) => ({ text, accent: false })),
    ...HERO.statementAccent.split(' ').map((text) => ({ text, accent: true })),
  ];
  protected readonly dentist = DENTIST;
  protected readonly specialty = specialtyLabel();
  protected readonly whatsapp = whatsappUrl();
  protected readonly rating = CONTACT.googleRating;
  protected readonly reviewCount = CONTACT.googleReviewCount;
  protected readonly googleUrl = CONTACT.googleProfileUrl;
  private readonly anim = inject(ScrollAnimationService);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() =>
      this.anim.attach(host, destroyRef, ({ gsap }, c) => {
        const section = host.querySelector<HTMLElement>('.hero')!;
        const media = host.querySelector<HTMLElement>('.hero__media');
        const content = host.querySelector<HTMLElement>('.hero__content');
        const photo = host.querySelector<HTMLElement>('.hero__img-wrap');

        // A intro (A1/A2/A3 adaptados) é 100% CSS (hero.scss, html.intro-pending):
        // começa no primeiro paint, sem depender do JS, e não atrasa o LCP.

        if (c.reduce) return;

        // ---------------- Hero flow (A14) ----------------
        if (c.pin) {
          section.classList.add('is-flow');
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
              },
            })
            .to(content, { y: '-14vh', autoAlpha: 0.15, ease: EASE.ease }, 0)
            .to(media, { y: '-5vh', ease: EASE.ease }, 0)
            .to(photo, { scale: 1.1, ease: EASE.in }, 0)
            .to('.hero__scroll', { autoAlpha: 0, duration: 0.2 }, 0);
          return () => section.classList.remove('is-flow');
        }

        if (photo) {
          gsap.set(photo, { scale: 1.1, transformOrigin: '50% 100%' });
          gsap.to(photo, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
        return undefined;
      }),
    );
  }

  protected goTo(event: MouseEvent, id: string): void {
    if (this.anim.scrollToId(id)) event.preventDefault();
  }
}
