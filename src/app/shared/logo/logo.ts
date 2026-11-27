import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CLINIC } from '../../core/data/site-content';

/**
 * Logotipo PROVISÓRIO: ícone de dente + nome da clínica (CLINIC.name).
 * TODO(logo): substituir pelo arquivo oficial do logo (SVG de preferência) quando houver.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      color: inherit;
      line-height: 1;
      min-width: 0;
    }
    .mark {
      display: grid;
      place-items: center;
      flex: none;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--c-deep);
      color: var(--c-on-dark);
      font-family: var(--font-display);
      font-size: 1rem;
      letter-spacing: -0.04em;
    }
    .mark svg {
      width: 1.35rem;
      height: 1.35rem;
      transition:
        background-color var(--dur-s) var(--ease-out),
        color var(--dur-s) var(--ease-out);
    }
    .text {
      display: grid;
      min-width: 0;
      gap: 0.2rem;
    }
    .name {
      font-family: var(--font-display);
      font-size: 1.25rem;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.85;
    }
    @media (max-width: 19.99em) {
      .sub {
        display: none;
      }
    }
    :host(.logo--light) .mark {
      background: var(--c-on-dark);
      color: var(--c-deep);
    }
  `,
  template: `
    <span class="mark" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      >
        <path
          d="M7.2 3.2c-2.3 0-4 1.9-4 4.4 0 2.2.8 3.9 1.5 5.8.6 1.7.8 3.6 1.2 5.5.3 1.4.8 2.1 1.6 2.1 1 0 1.3-1 1.6-2.4.4-1.8.8-3.5 2.9-3.5s2.5 1.7 2.9 3.5c.3 1.4.6 2.4 1.6 2.4.8 0 1.3-.7 1.6-2.1.4-1.9.6-3.8 1.2-5.5.7-1.9 1.5-3.6 1.5-5.8 0-2.5-1.7-4.4-4-4.4-1.8 0-2.8 1-4.8 1s-3-1-4.8-1z"
        />
      </svg>
    </span>
    <span class="text">
      <span class="name">{{ clinicName }}</span>
      @if (showSub()) {
        <span class="sub">Odontologia</span>
      }
    </span>
  `,
})
export class Logo {
  readonly showSub = input(true);
  protected readonly clinicName = CLINIC.name;
}
