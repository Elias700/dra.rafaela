import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ADDRESS, CLINIC, CONTACT, DENTIST } from '../../core/data/site-content';
import { SeoService } from '../../core/seo/seo.service';

/**
 * Política de Privacidade (LGPD — Lei 13.709/2018).
 * TODO(privacidade): texto-base. Precisa ser revisado por quem responde juridicamente
 * pelo consultório antes de publicar (controlador, canal do titular, operadores,
 * prazo de retenção, ferramentas de análise, se houver).
 * Enquanto não for revisado, a página fica com `noindex`.
 */
@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './privacy.scss',
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly clinic = CLINIC;
  protected readonly dentist = DENTIST;
  protected readonly contact = CONTACT;
  protected readonly address = ADDRESS;
  protected readonly updated = '19 de novembro de 2026';

  constructor() {
    inject(SeoService).setPage({
      title: `Política de Privacidade | ${CLINIC.name}`,
      description:
        'Saiba como a clínica trata os dados pessoais enviados pelo site, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
      path: '/politica-de-privacidade',
      robots: 'noindex, follow',
    });
  }
}
