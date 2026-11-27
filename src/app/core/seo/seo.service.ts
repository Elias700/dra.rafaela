import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CLINIC, SITE } from '../data/site-content';
import { buildHomeJsonLd } from './json-ld';

export interface PageSeo {
  title: string;
  description: string;
  /** Caminho a partir da raiz, ex.: '/' ou '/politica-de-privacidade' */
  path: string;
  robots?: string;
  jsonLd?: object | null;
}

/**
 * Metatags, canonical e JSON-LD. Roda no servidor (prerender) e o resultado vai
 * para o HTML estático (AGENTS.md §7).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setHome(): void {
    this.setPage({
      title: SITE.title,
      description: SITE.description,
      path: '/',
      jsonLd: buildHomeJsonLd(),
    });
  }

  setPage(page: PageSeo): void {
    const url = this.absolute(page.path);
    const image = this.absolute(SITE.ogImage);

    this.title.setTitle(page.title);
    this.tag('name', 'description', page.description);
    this.tag('name', 'robots', page.robots ?? 'index, follow, max-image-preview:large');
    this.tag('name', 'theme-color', SITE.themeColor);

    this.tag('property', 'og:type', 'website');
    this.tag('property', 'og:locale', 'pt_BR');
    this.tag('property', 'og:site_name', CLINIC.displayName);
    this.tag('property', 'og:title', page.title);
    this.tag('property', 'og:description', page.description);
    this.tag('property', 'og:image', image);
    this.tag('property', 'og:image:width', '1200');
    this.tag('property', 'og:image:height', '630');
    this.tag('property', 'og:image:alt', `${CLINIC.displayName} — odontologia`);
    if (SITE.url) this.tag('property', 'og:url', url);

    this.tag('name', 'twitter:card', 'summary_large_image');
    this.tag('name', 'twitter:title', page.title);
    this.tag('name', 'twitter:description', page.description);
    this.tag('name', 'twitter:image', image);

    this.setCanonical(SITE.url ? url : null);
    this.setJsonLd(page.jsonLd ?? null);
  }

  /** TODO(domínio): enquanto SITE.url for null, as URLs ficam relativas e o canonical é omitido. */
  private absolute(path: string): string {
    return SITE.url ? `${SITE.url}${path}` : path;
  }

  private tag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private setCanonical(href: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(data: object | null): void {
    const head = this.document.head;
    head.querySelector('script#ld-json')?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'ld-json');
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    head.appendChild(script);
  }
}
