import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TESTIMONIALS_CONFIG } from '../../core/data/testimonials';
import { SeoService } from '../../core/seo/seo.service';
import { About } from '../../sections/about/about';
import { Care } from '../../sections/care/care';
import { Contact } from '../../sections/contact/contact';
import { Faq } from '../../sections/faq/faq';
import { FirstVisit } from '../../sections/first-visit/first-visit';
import { Hero } from '../../sections/hero/hero';
import { Implants } from '../../sections/implants/implants';
import { LocationSection } from '../../sections/location/location';
import { Testimonials } from '../../sections/testimonials/testimonials';
import { Treatments } from '../../sections/treatments/treatments';

/**
 * Página única. Além do hero, as seções usam `@defer (hydrate on idle)`:
 * o HTML vem completo do prerender (SEO/sem JS) e o JS de cada seção é baixado
 * e hidratado quando o navegador fica ocioso.
 */
@Component({
  selector: 'app-home',
  imports: [
    Hero,
    About,
    Treatments,
    Implants,
    Care,
    FirstVisit,
    Testimonials,
    LocationSection,
    Faq,
    Contact,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    @defer (hydrate on idle) {
      <app-about />
    }
    @defer (hydrate on idle) {
      <app-treatments />
    }
    @defer (hydrate on idle) {
      <app-implants />
    }
    @defer (hydrate on idle) {
      <app-care />
    }
    @defer (hydrate on idle) {
      <app-first-visit />
    }
    @if (testimonialsEnabled) {
      @defer (hydrate on idle) {
        <app-testimonials />
      }
    }
    @defer (hydrate on idle) {
      <app-location />
    }
    @defer (hydrate on idle) {
      <app-faq />
    }
    @defer (hydrate on idle) {
      <app-contact />
    }
  `,
})
export class Home {
  protected readonly testimonialsEnabled = TESTIMONIALS_CONFIG.enabled;

  constructor() {
    inject(SeoService).setHome();
  }
}
