import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PulseDirective } from '../../core/animations/pulse.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrollSceneDirective } from '../../core/animations/scroll-scene.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import {
  ADDRESS,
  CLINIC,
  LOCATION,
  OPENING_HOURS,
  addressLine,
  cityLine,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  wazeUrl,
} from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/**
 * Localização — A19 (card se aproxima), A20 (fundo assenta), A38 (pulso do marcador).
 * O mapa do Google só é carregado quando a área fica perto da tela (IntersectionObserver).
 */
@Component({
  selector: 'app-location',
  imports: [Icon, RevealDirective, SplitTextDirective, ScrollSceneDirective, PulseDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location.html',
  styleUrl: './location.scss',
})
export class LocationSection {
  protected readonly content = LOCATION;
  protected readonly clinic = CLINIC;
  protected readonly address = ADDRESS;
  protected readonly addressLine = addressLine();
  protected readonly cityLine = cityLine();
  protected readonly hours = OPENING_HOURS;
  protected readonly directionsUrl = mapsDirectionsUrl();
  protected readonly wazeUrl = wazeUrl();
  private readonly embedUrl = mapsEmbedUrl();
  protected readonly mapSrc = this.embedUrl
    ? inject(DomSanitizer).bypassSecurityTrustResourceUrl(this.embedUrl)
    : null;
  protected readonly showMap = signal(false);
  private readonly mapBox = viewChild.required<ElementRef<HTMLElement>>('mapBox');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.showMap.set(true);
            io.disconnect();
          }
        },
        { rootMargin: '200px 0px' },
      );
      io.observe(this.mapBox().nativeElement);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
