/**
 * Depoimentos reais (avaliações públicas, ex.: Google) — AGENTS.md §6.
 *
 * TODO(depoimentos): nenhum cadastrado. Preencha só com avaliações reais da clínica
 * (primeiro nome + inicial do sobrenome, sem menção a preço) e mude `enabled` para `true`.
 * NÃO marcar como Review/AggregateRating no JSON-LD.
 */

export interface Testimonial {
  readonly name: string;
  readonly text: string;
}

export const TESTIMONIALS_CONFIG = {
  enabled: false,
  title: 'O que dizem os pacientes',
  sourceLabel: 'Avaliação no Google',
  seeAllLabel: 'Ver todas as avaliações no Google',
} as const;

export const TESTIMONIALS: readonly Testimonial[] = [];
