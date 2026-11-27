import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Ilustrações de linha das etapas do implante (feitas para o projeto).
 * Didáticas e suaves: sem boca aberta, sangue ou cirurgia (AGENTS.md §5).
 */
@Component({
  selector: 'app-implant-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .s {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .g {
      stroke: var(--art-accent, #d9b97a);
    }
    .soft {
      opacity: 0.35;
    }
    .fill {
      fill: var(--art-fill, rgb(255 255 255 / 0.06));
    }
  `,
  template: `
    <svg viewBox="0 0 240 240" focusable="false">
      <circle class="fill" cx="120" cy="120" r="104" />
      <circle class="s soft" cx="120" cy="120" r="104" stroke-dasharray="2 6" />
      @switch (step()) {
        @case (0) {
          <g transform="translate(48 40) scale(5)">
            <path
              class="s"
              d="M7.2 3.2c-2.3 0-4 1.9-4 4.4 0 2.2.8 3.9 1.5 5.8.6 1.7.8 3.6 1.2 5.5.3 1.4.8 2.1 1.6 2.1 1 0 1.3-1 1.6-2.4.4-1.8.8-3.5 2.9-3.5s2.5 1.7 2.9 3.5c.3 1.4.6 2.4 1.6 2.4.8 0 1.3-.7 1.6-2.1.4-1.9.6-3.8 1.2-5.5.7-1.9 1.5-3.6 1.5-5.8 0-2.5-1.7-4.4-4-4.4-1.8 0-2.8 1-4.8 1s-3-1-4.8-1z"
            />
          </g>
          <circle class="s g" cx="156" cy="150" r="26" />
          <path class="s g" d="M175 169l20 20" />
          <path class="s g soft" d="M144 142a14 14 0 0 1 12-6" />
        }
        @case (1) {
          <rect class="s" x="70" y="52" width="100" height="136" rx="12" />
          <path class="s" d="M100 52v-6a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v6" />
          <path class="s g" d="m86 92 6 6 12-13M86 126l6 6 12-13M86 160l6 6 12-13" />
          <path class="s soft" d="M116 94h38M116 128h38M116 162h28" />
        }
        @case (2) {
          <path class="s soft" d="M40 112c20-10 40-10 60 0s40 10 60 0 40-10 60 0" />
          <path class="s soft" d="M44 150h152M52 176h136M64 200h112" stroke-dasharray="3 7" />
          <g transform="translate(84 92) scale(3)">
            <path class="s g" d="M9.2 8.9h5.6l-.7 10.6a2.1 2.1 0 0 1-4.2 0z" />
            <path class="s g" d="M9 12.2h6M9.3 15.2h5.4M9.6 18.2h4.8" />
          </g>
          <path class="s" d="M120 56v24M108 68l12 12 12-12" />
        }
        @case (3) {
          <path class="s soft" d="M40 112c20-10 40-10 60 0s40 10 60 0 40-10 60 0" />
          <path class="s soft" d="M44 150h152M52 176h136M64 200h112" stroke-dasharray="3 7" />
          <g transform="translate(84 92) scale(3)">
            <path class="s g" d="M9.2 8.9h5.6l-.7 10.6a2.1 2.1 0 0 1-4.2 0z" />
            <path class="s g" d="M9 12.2h6M9.3 15.2h5.4M9.6 18.2h4.8" />
          </g>
          <path
            class="s"
            d="M86 150a40 40 0 0 1 68 0M74 170a56 56 0 0 1 92 0"
            stroke-dasharray="4 6"
          />
          <path class="s g" d="M150 60c0-14 10-24 28-24-1 18-10 26-24 26" />
          <path class="s g" d="M150 62c6-7 12-12 18-16" />
        }
        @case (4) {
          <path class="s soft" d="M40 132c20-10 40-10 60 0s40 10 60 0 40-10 60 0" />
          <path class="s soft" d="M44 170h152M56 196h128" stroke-dasharray="3 7" />
          <g transform="translate(84 112) scale(3)">
            <path class="s g" d="M9.2 8.9h5.6l-.7 10.6a2.1 2.1 0 0 1-4.2 0z" />
            <path class="s g" d="M9 12.2h6M9.3 15.2h5.4M9.6 18.2h4.8" />
          </g>
          <path
            class="s"
            d="M98 70c0-12 9-20 22-20s22 8 22 20v10c0 12-6 24-12 34h-20c-6-10-12-22-12-34z"
          />
          <path class="s soft" d="M106 64c4-4 8-5 14-5" />
        }
        @default {
          <g transform="translate(60 48) scale(5)">
            <path
              class="s"
              d="M7.2 3.2c-2.3 0-4 1.9-4 4.4 0 2.2.8 3.9 1.5 5.8.6 1.7.8 3.6 1.2 5.5.3 1.4.8 2.1 1.6 2.1 1 0 1.3-1 1.6-2.4.4-1.8.8-3.5 2.9-3.5s2.5 1.7 2.9 3.5c.3 1.4.6 2.4 1.6 2.4.8 0 1.3-.7 1.6-2.1.4-1.9.6-3.8 1.2-5.5.7-1.9 1.5-3.6 1.5-5.8 0-2.5-1.7-4.4-4-4.4-1.8 0-2.8 1-4.8 1s-3-1-4.8-1z"
            />
          </g>
          <path
            class="s g"
            d="M170 70c-6-8-20-6-20 5 0 9 13 16 20 22 7-6 20-13 20-22 0-11-14-13-20-5z"
          />
          <path class="s g soft" d="M52 70v12M46 76h12M188 150v10M183 155h10" />
        }
      }
    </svg>
  `,
})
export class ImplantArt {
  readonly step = input.required<number>();
}
