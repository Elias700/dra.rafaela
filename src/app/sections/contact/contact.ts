import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FrameShrinkDirective } from '../../core/animations/frame-shrink.directive';
import { MagneticDirective } from '../../core/animations/magnetic.directive';
import { ContactResult, ContactService } from '../../core/data/contact.service';
import {
  CLINIC,
  CONTACT,
  CONTACT_SECTION,
  DENTIST,
  whatsappUrl,
} from '../../core/data/site-content';
import { Icon } from '../../shared/icon/icon';

/** Formata o telefone enquanto digita: (00) 00000-0000 */
function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Contato / Agendamento — A21 (moldura que encolhe), A26 (CTA magnético), A40 (labels).
 * Formulário curto (LGPD): sem nenhum campo de histórico de saúde.
 */
@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, Icon, FrameShrinkDirective, MagneticDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly service = inject(ContactService);

  protected readonly content = CONTACT_SECTION;
  protected readonly contact = CONTACT;
  protected readonly dentist = DENTIST;
  protected readonly clinic = CLINIC;
  protected readonly whatsapp = whatsappUrl();

  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly result = signal<ContactResult | null>(null);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
    interest: ['', Validators.required],
    period: ['', Validators.required],
    consent: [false, Validators.requiredTrue],
  });

  protected onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatPhone(input.value);
    this.form.controls.phone.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.result.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Foco no primeiro campo com erro (ordem do formulário).
      const ids: Record<string, string> = {
        name: 'cf-name',
        phone: 'cf-phone',
        interest: 'cf-interest',
        period: 'cf-period-first',
        consent: 'cf-consent',
      };
      const first = Object.keys(ids).find((key) => this.form.get(key)?.invalid);
      if (first) document.getElementById(ids[first])?.focus();
      return;
    }
    this.sending.set(true);
    const value = this.form.getRawValue();
    const result = await this.service.submit({
      name: value.name.trim(),
      phone: value.phone,
      interest: value.interest,
      period: value.period,
      consent: true,
    });
    this.sending.set(false);
    this.result.set(result);
    if (result === 'sent' || result === 'whatsapp') {
      this.form.reset();
      this.submitted.set(false);
    }
  }
}
