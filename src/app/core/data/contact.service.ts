import { Injectable } from '@angular/core';
import { CONTACT_FORM_ENDPOINT, whatsappUrl } from './site-content';

export interface ContactRequest {
  name: string;
  phone: string;
  interest: string;
  period: string;
  consent: true;
}

export type ContactResult = 'sent' | 'whatsapp' | 'unconfigured' | 'error';

/**
 * Envio do formulário de contato, desacoplado da UI.
 * - Com `CONTACT_FORM_ENDPOINT`: POST JSON. TODO(formulário): definir o endpoint
 *   (ex.: função serverless, Formspree, e-mail transacional) e a política de retenção (LGPD).
 * - Sem endpoint, mas com WhatsApp: abre o WhatsApp com a mensagem pronta.
 * - Sem nenhum dos dois: retorna 'unconfigured' (a UI orienta outro contato).
 *
 * Não envia nem pede dados de saúde (AGENTS.md §8).
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async submit(data: ContactRequest): Promise<ContactResult> {
    if (CONTACT_FORM_ENDPOINT) {
      try {
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, source: 'site', sentAt: new Date().toISOString() }),
        });
        return response.ok ? 'sent' : 'error';
      } catch {
        return 'error';
      }
    }

    const url = whatsappUrl(
      `Olá! Meu nome é ${data.name}. Gostaria de agendar uma avaliação` +
        ` (${data.interest.toLowerCase()}). Melhor período: ${data.period.toLowerCase()}. Telefone: ${data.phone}.`,
    );
    if (url) {
      window.open(url, '_blank', 'noopener');
      return 'whatsapp';
    }
    return 'unconfigured';
  }
}
