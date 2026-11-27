import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'tooth'
  | 'implant'
  | 'sparkle'
  | 'bridge'
  | 'chat'
  | 'list'
  | 'leaf'
  | 'pin'
  | 'whatsapp'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'phone'
  | 'mail'
  | 'instagram'
  | 'clock'
  | 'plus'
  | 'pause'
  | 'play'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'star'
  | 'check'
  | 'navigation';

/** Ícones de linha finos, desenhados para o projeto (decorativos: aria-hidden). */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  styles: `
    :host {
      display: inline-flex;
      width: 1.5rem;
      height: 1.5rem;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  template: `
    @switch (name()) {
      @case ('whatsapp') {
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path
            d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"
          />
        </svg>
      }
      @case ('star') {
        <svg viewBox="0 0 24 24" fill="currentColor" focusable="false">
          <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
        </svg>
      }
      @default {
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          focusable="false"
        >
          @switch (name()) {
            @case ('tooth') {
              <path
                d="M7.2 3.2c-2.3 0-4 1.9-4 4.4 0 2.2.8 3.9 1.5 5.8.6 1.7.8 3.6 1.2 5.5.3 1.4.8 2.1 1.6 2.1 1 0 1.3-1 1.6-2.4.4-1.8.8-3.5 2.9-3.5s2.5 1.7 2.9 3.5c.3 1.4.6 2.4 1.6 2.4.8 0 1.3-.7 1.6-2.1.4-1.9.6-3.8 1.2-5.5.7-1.9 1.5-3.6 1.5-5.8 0-2.5-1.7-4.4-4-4.4-1.8 0-2.8 1-4.8 1s-3-1-4.8-1z"
              />
            }
            @case ('implant') {
              <path
                d="M8 2.8h8a2 2 0 0 1 2 2v1.1a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V4.8a2 2 0 0 1 2-2z"
              />
              <path d="M9.2 8.9h5.6l-.7 10.6a2.1 2.1 0 0 1-4.2 0z" />
              <path d="M9 12.2h6M9.3 15.2h5.4M9.6 18.2h4.8" />
            }
            @case ('sparkle') {
              <path
                d="M6.4 6.2c-1.9 0-3.3 1.6-3.3 3.6 0 1.8.7 3.2 1.2 4.8.5 1.4.7 3 1 4.6.3 1.1.7 1.8 1.3 1.8.8 0 1.1-.8 1.3-2 .3-1.5.7-2.9 2.4-2.9s2 1.4 2.4 2.9c.2 1.2.5 2 1.3 2 .6 0 1-.7 1.3-1.8.3-1.6.5-3.2 1-4.6"
              />
              <path d="M18 2.5v5M15.5 5h5M20.5 10.5v3M19 12h3" />
            }
            @case ('bridge') {
              <path d="M3.5 8.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v2.2h-17z" />
              <path d="M4.8 10.7v4.6c0 1.2.7 2.4 1.7 2.4s1.6-1.2 1.6-2.4v-4.6" />
              <path d="M10.3 10.7v5.6c0 1.2.7 2.4 1.7 2.4s1.7-1.2 1.7-2.4v-5.6" />
              <path d="M15.9 10.7v4.6c0 1.2.6 2.4 1.6 2.4s1.7-1.2 1.7-2.4v-4.6" />
            }
            @case ('chat') {
              <path d="M20.5 11.5a8 8 0 0 1-11.8 7l-4.2 1.2 1.2-3.9a8 8 0 1 1 14.8-4.3z" />
              <path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" stroke-width="2" />
            }
            @case ('list') {
              <path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10" />
              <path
                d="m3.8 6.4 1.3 1.3 2.3-2.5M3.8 11.9l1.3 1.3 2.3-2.5M3.8 17.4l1.3 1.3 2.3-2.5"
              />
            }
            @case ('leaf') {
              <path d="M5 19c0-8 5.5-13.5 15-14-.4 9.5-6 15-14 15" />
              <path d="M5 19c3-3.2 5.8-5.6 9-7.5" />
            }
            @case ('pin') {
              <path d="M12 21.2s7-5.8 7-11.7a7 7 0 1 0-14 0c0 5.9 7 11.7 7 11.7z" />
              <circle cx="12" cy="9.6" r="2.6" />
            }
            @case ('arrow-right') {
              <path d="M4.5 12h15M13.5 6l6 6-6 6" />
            }
            @case ('arrow-up-right') {
              <path d="M7 17 17 7M8.5 7H17v8.5" />
            }
            @case ('phone') {
              <path
                d="M20.5 16.6v2.6a1.7 1.7 0 0 1-1.9 1.7 17 17 0 0 1-7.4-2.6 16.7 16.7 0 0 1-5.1-5.1 17 17 0 0 1-2.6-7.5A1.7 1.7 0 0 1 5.2 3.8h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.8.3 1.6.6 2.4a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a13.6 13.6 0 0 0 5.1 5.1l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.4.6a1.7 1.7 0 0 1 1.5 1.8z"
              />
            }
            @case ('mail') {
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
            }
            @case ('instagram') {
              <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
              <circle cx="12" cy="12" r="4.1" />
              <path d="M17.3 6.7h.01" stroke-width="2" />
            }
            @case ('clock') {
              <circle cx="12" cy="12" r="8.8" />
              <path d="M12 7v5.2l3.3 2" />
            }
            @case ('plus') {
              <path d="M12 4.5v15M4.5 12h15" />
            }
            @case ('pause') {
              <path d="M9 5.5v13M15 5.5v13" stroke-width="2" />
            }
            @case ('play') {
              <path d="M7.5 5.2v13.6L18.5 12z" />
            }
            @case ('chevron-left') {
              <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
            }
            @case ('chevron-right') {
              <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
            }
            @case ('close') {
              <path d="M6 6l12 12M18 6 6 18" />
            }
            @case ('check') {
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            }
            @case ('navigation') {
              <path d="M3.5 11 20.5 3.5 13 20.5l-2-7.5z" />
            }
          }
        </svg>
      }
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
