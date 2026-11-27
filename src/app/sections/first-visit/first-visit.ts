import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { FIRST_VISIT } from '../../core/data/site-content';

/** Sua primeira consulta — A7 (linha do tempo que se desenha), A3 (números), A5/A6 (texto). */
@Component({
  selector: 'app-first-visit',
  imports: [RevealDirective, SplitTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './first-visit.html',
  styleUrl: './first-visit.scss',
})
export class FirstVisit {
  protected readonly content = FIRST_VISIT;
}
