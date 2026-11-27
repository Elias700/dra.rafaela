import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';
import { ScrollProgress } from './shared/scroll-progress/scroll-progress';
import { WhatsappFab } from './shared/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, WhatsappFab, ScrollProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <app-header />
    <main id="conteudo" tabindex="-1">
      <router-outlet />
    </main>
    @defer (hydrate on idle) {
      <app-footer />
    }
    @defer (hydrate on idle) {
      <app-whatsapp-fab />
      <app-scroll-progress />
    }
  `,
  styles: `
    main:focus {
      outline: none;
    }
  `,
})
export class App {}
