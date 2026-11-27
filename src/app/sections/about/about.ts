import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageMaskDirective } from '../../core/animations/image-mask.directive';
import { ParallaxDirective } from '../../core/animations/parallax.directive';
import { RevealDirective } from '../../core/animations/reveal.directive';
import { SplitTextDirective } from '../../core/animations/split-text.directive';
import { ABOUT, DENTIST, specialtyLabel } from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/** Sobre — A4/A5 (texto), A8 (máscara diagonal na foto), A10 (parallax), A7 (traço). */
@Component({
  selector: 'app-about',
  imports: [Icon, RevealDirective, SplitTextDirective, ImageMaskDirective, ParallaxDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly about = ABOUT;
  protected readonly dentist = DENTIST;
  protected readonly specialty = specialtyLabel();
}
