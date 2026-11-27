import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ParallaxDirective } from '../../core/animations/parallax.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { ScrollSceneDirective } from '../../core/animations/scroll-scene.directive';
import { SpreadWordsDirective } from '../../core/animations/spread-words.directive';
import { PILLARS, PILLARS_INTRO } from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/**
 * Por que escolher a clínica — A15 (palavras do título se aproximam), A6 (pilares com stagger),
 * A17 (zoom-through suave na saída, desktop), A13 (formas decorativas com parallax).
 * Sem contadores: não há números confirmados (AGENTS.md §6).
 */
@Component({
  selector: 'app-care',
  imports: [Icon, RevealDirective, SpreadWordsDirective, ScrollSceneDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './care.html',
  styleUrl: './care.scss',
})
export class Care {
  protected readonly intro = PILLARS_INTRO;
  protected readonly pillars = PILLARS;
}
