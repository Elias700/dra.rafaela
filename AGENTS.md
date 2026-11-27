# AGENTS.md — Landing page odontológica (cliente a definir)

Guia de trabalho para qualquer agente de IA (Claude, Codex, Cursor etc.) neste repositório. **Leia este arquivo inteiro antes de qualquer alteração.**

## 1. Visão geral do projeto

Landing page de um consultório odontológico. **Cliente, nome, endereço, registros e fotos estão pendentes**: tudo fica como placeholder em `src/app/core/data/site-content.ts` até ser definido.

| Item                 | Valor                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nome de exibição     | _pendente_ (placeholder: "Nome da Clínica")                                                                                                      |
| Profissional         | _pendente_ (placeholder: "Dr(a). Nome Sobrenome", CRO-UF 00000)                                                                                  |
| Pessoa jurídica      | _pendente_ (placeholder: EPAO CRO-UF 0000)                                                                                                       |
| Local                | _pendente_ (mapa e rotas ficam ocultos até haver endereço)                                                                                       |
| Posicionamento       | Atendimento humanizado e especializado, com foco em implantes dentários                                                                          |
| Serviços confirmados | Clínica geral (dentista), Implantes dentários (destaque), Clareamento dental, Dentaduras e pontes (prótese dentária)                             |
| Idioma               | Português do Brasil (pt-BR)                                                                                                                      |
| Objetivo do site     | Passar confiança, acolhimento e competência técnica, mostrar os tratamentos e levar o visitante a agendar uma avaliação (WhatsApp ou formulário) |
| Tom                  | Acolhedor, humano, calmo e seguro. Muita gente tem medo de dentista, então o texto deve tranquilizar, sem jargão excessivo nem tom de vendas     |

O diferencial do projeto são as **animações de scroll**. Elas vêm do site de referência clonado em `src/clone`. Trate essa parte como prioridade número um, sem abrir mão de desempenho, acessibilidade e SEO. Num site de saúde, as animações devem transmitir leveza, limpeza e calma: suaves e fluidas, nunca agressivas.

## 2. Stack e convenções

- **Angular** (versão do `package.json`, não faça downgrade nem upgrade de versão maior sem pedir) com TypeScript em modo `strict`.
- **Standalone components** em tudo. Nada de `NgModule`.
- **Signals** (`signal`, `computed`, `input()`, `output()`) para estado e entradas. Use `inject()` em vez de injeção pelo construtor.
- **Control flow nativo** (`@if`, `@for`, `@defer`). Não use `*ngIf`/`*ngFor`.
- `ChangeDetectionStrategy.OnPush` em todos os componentes.
- **SSR e prerender** com `@angular/ssr` (se ainda não estiver instalado: `ng add @angular/ssr`) e prerender da rota `/`. Isso é obrigatório para o SEO.
- Estilos em **SCSS**, com design tokens em CSS custom properties (`src/styles/_tokens.scss`). Sem Bootstrap ou Tailwind, a não ser que o usuário peça.
- Imagens com `NgOptimizedImage` (`ngSrc`, `width`/`height` ou `fill`, `priority` só na imagem do hero), em WebP/AVIF e com `srcset` responsivo.
- Nomes de arquivos em kebab-case. Nomes de classes, variáveis e código em inglês. **Todo o texto visível em português.**
- Não adicione dependências sem justificar. Bibliotecas de animação são aceitas só se o clone já usar a mesma (ver seção 4).

### Estrutura de pastas esperada

```
src/
├── app/
│   ├── core/
│   │   ├── animations/        # serviço e diretivas de scroll (port do clone)
│   │   ├── seo/               # SeoService, JSON-LD
│   │   └── data/              # conteúdo do site tipado (site-content.ts, testimonials.ts)
│   ├── sections/              # hero, about, treatments, implants, care, first-visit, testimonials, location, faq, contact
│   ├── shared/                # header, footer, botões, whatsapp-fab, ícones
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── clone/                     # SOMENTE REFERÊNCIA, nunca entra no bundle
├── styles/                    # _tokens.scss, _typography.scss, _reset.scss, _mixins.scss
└── styles.scss
public/                        # logo, fotos do(a) profissional e do consultório, favicon, og-image, robots.txt, sitemap.xml
docs/
└── clone-analysis.md          # gerado pelo agente na Fase 0
```

## 3. A pasta `src/clone` (referência)

`src/clone` tem a cópia de um site de referência baixado com o vibecloner. Regras:

1. **Só para estudo.** Nunca importe, referencie ou empacote arquivos de `src/clone` no app. Garanta que ela fique fora do build:
   - em `tsconfig.app.json`: `"exclude": ["src/clone/**"]`;
   - não inclua `src/clone` em `assets` nem em `styles` no `angular.json`.
2. Aproveite apenas o **comportamento de movimento e de interação**: timings, easings, sequências, padrões de scroll (pin, parallax, reveal, split text, máscara de imagem, scrub, scroll horizontal, troca de cor de fundo, zoom, marquee, smooth scroll, loader, transições de menu e hovers).
3. **Não copie a identidade do site original**: nenhum texto, imagem, logo, fonte licenciada, nome ou layout idêntico de marca.
4. Antes de programar qualquer seção, gere `docs/clone-analysis.md` (ver `PROMPT.md`, Fase 0).
5. Código minificado ou empacotado do clone deve ser reescrito em TypeScript limpo e tipado, sem colar blocos minificados.

## 4. Animações de scroll (prioridade máxima)

### Arquitetura

- Centralize tudo em `src/app/core/animations/`:
  - `scroll-animation.service.ts`: inicializa a biblioteca (ex.: GSAP + ScrollTrigger, Lenis), registra plugins, faz o refresh e expõe utilitários;
  - diretivas reutilizáveis aplicadas no template, por exemplo `appReveal`, `appParallax`, `appSplitText`, `appPinSection`, `appImageMask`, `appImageZoom`, `appHorizontalScroll`, `appBgShift`, `appMarquee`, `appCounter`. Cada padrão encontrado no clone vira uma diretiva configurável por `input()`.
- Se o clone usar GSAP/ScrollTrigger/Lenis/Locomotive, use a mesma lib via npm (versão atual, licença compatível). Se usar animação própria com IntersectionObserver ou CSS, reimplemente da mesma forma, sem lib extra.

### Regras obrigatórias

- **Compatível com SSR**: nenhum acesso a `window`, `document` ou `gsap` no servidor. Inicialize com `afterNextRender()` ou proteja com `isPlatformBrowser()`.
- **Fora da zona do Angular**: rode loops e listeners de scroll dentro de `NgZone.runOutsideAngular()`.
- **Limpeza**: todo ScrollTrigger, timeline, observer e instância do Lenis é destruído no `DestroyRef.onDestroy` (use `gsap.context()` + `ctx.revert()`).
- **Conteúdo visível sem JS**: o estado inicial "escondido" só pode ser aplicado depois que o JS iniciar (ex.: classe `.js-anim` no `<html>`). O HTML do SSR precisa ser legível e indexável sem animação.
- **Loader/intro** (se houver no clone): curto (no máximo ~1,2s), sem bloquear o LCP, uma vez por sessão.
- **`prefers-reduced-motion: reduce`**: desligue parallax, pin, scrub, zoom, marquee e smooth scroll; mostre o conteúdo direto ou com um fade curto.
- **Desempenho**: anime só `transform` e `opacity` (e `clip-path` quando necessário). Nada de animar `top`, `left`, `width`, `height` ou `margin`. Use `will-change` com moderação. Meta: 60 fps num celular intermediário. A maioria dos pacientes vai acessar pelo celular, vindos do Google Maps ou do Instagram, então **o mobile é prioridade**.
- **Sem CLS**: reserve o espaço dos elementos animados com `aspect-ratio`. Animação nunca empurra layout.
- **Mobile**: simplifique onde preciso (pins longos, scroll horizontal e parallax pesado viram reveals ou carrossel com swipe abaixo de 768px), via `gsap.matchMedia()` ou `matchMedia`. Cursor customizado só em `pointer: fine`.
- **Âncoras e smooth scroll**: os links do menu devem rolar até a seção certa, compensando o header fixo, e o foco deve ir para a seção.
- Recalcule os gatilhos depois que imagens e fontes carregarem (`ScrollTrigger.refresh()`).

## 5. Design

- **Direção de arte**: clínica moderna, limpa e acolhedora, longe do visual "hospitalar frio". Muito branco e respiro, cantos suaves, fotos reais e luminosas do consultório e do(a) profissional, sorrisos naturais.
- **Paleta**: extraia a cor principal do logo em `public/`. Direção sugerida: branco/off-white como base, um tom suave de apoio (azul-água, verde-sálvia, nude ou rosé, conforme o logo) e um tom mais profundo para títulos e CTAs. Use as trocas de cor de fundo do clone com suavidade.
- **Tipografia**: uma serifada moderna ou uma sans geométrica elegante para títulos (ex.: Fraunces, DM Serif Display ou Sora) e uma sans muito legível para texto (ex.: Inter, Manrope ou Nunito Sans), com `font-display: swap`, de preferência hospedadas localmente. Use tamanhos fluidos com `clamp()` e texto de corpo com no mínimo 16px.
- **Imagens**: use somente as de `public/`. Liste os arquivos antes de usar e escolha cada foto pela função. **Nunca invente caminhos.** Nada de imagens de procedimentos com sangue, cirurgia ou close de boca aberta: o site deve ser agradável para quem tem medo de dentista. Ícones de linha finos para os tratamentos.
- **Responsividade total**: teste em 320, 375, 414, 768, 1024, 1280, 1440, 1920 e 2560px. Mobile-first. Áreas de toque com no mínimo 44×44px. Sem rolagem horizontal involuntária.

## 6. Conteúdo e ética do CFO (obrigatório)

A publicidade odontológica segue o **Código de Ética Odontológica (Res. CFO-118/2012)**, a **Res. CFO-196/2019** (imagens), a **Lei 5.081/1966** e o **Código de Defesa do Consumidor**.

### Identificação obrigatória (rodapé e seção de contato, sempre visível)

- Nome do(a) profissional — Cirurgião(ã)-Dentista — **CRO-UF (pendente)**
- Nome da clínica — **EPAO CRO-UF (pendente)** — Responsável técnico(a): nome e CRO (pendentes)
- **Especialidade**: o título "Especialista em Implantodontia" só pode aparecer com a especialidade registrada no CRO. Deixe o número do registro de especialista como `TODO` em `site-content.ts` e pergunte ao usuário antes de publicar. Se não houver registro, troque por "Atuação em implantes dentários" e avise.

### Proibido

- prometer resultado ("sorriso perfeito garantido", "sem dor", "implante em 1 dia") ou usar superlativos ("o melhor dentista da cidade");
- mostrar preços, descontos, promoções, parcelamento, "avaliação grátis", sorteios e brindes;
- mostrar fotos de pacientes ou "antes e depois" sem que o usuário confirme a autorização por escrito do paciente. Mesmo com autorização, use apenas casos do(a) próprio(a) profissional, com nome e CRO na imagem;
- fazer comparação com outros profissionais ou criticar concorrentes.

### Depoimentos (seção "O que dizem os pacientes")

- Use **somente** depoimentos reais (avaliações públicas, ex.: Google) da clínica do cliente. Hoje não há nenhum: a seção fica desligada (`enabled: false`) e sai do menu.
- Não altere o sentido nem invente depoimentos. É permitido corrigir apenas grafia evidente (ex.: "mim fez" → "me fez").
- **Remova menções a preço** ("preço justo", "preço que cabe no orçamento"), cortando o trecho com reticências "(…)", para não violar a vedação de publicidade de preço.
- Exiba o nome como primeiro nome + inicial do sobrenome (privacidade) e o selo "Avaliação no Google". Não exiba a data relativa ("5 meses atrás"), que fica desatualizada.
- Coloque um link "Ver todas as avaliações no Google" (URL do perfil: `TODO`).
- **Não** marque esses depoimentos com `Review`/`AggregateRating` no JSON-LD: o Google não exibe avaliações publicadas pelo próprio negócio e isso pode ser visto como spam.
- Use `src/app/core/data/testimonials.ts` com uma flag `enabled` para a seção inteira, para poder desligar se o CRO orientar assim. Recomende ao usuário confirmar com o CRO.

### 6.1 Depoimentos reais

_Pendente._ Nenhum depoimento cadastrado. Preencha `TESTIMONIALS` em `src/app/core/data/testimonials.ts` só com avaliações reais da clínica.

### Escopo de serviços

- **Confirmados**: clínica geral, implantes dentários, clareamento dental, dentaduras e pontes.
- **Citados nos depoimentos, a confirmar** (`TODO`, fora da página até confirmação): limpeza/profilaxia, restaurações, aparelho ortodôntico, odontopediatria (atendimento infantil).

### Dados que não podem ser inventados

Nunca invente telefone/WhatsApp, e-mail, número da loja no shopping, piso, horário, Instagram, convênios aceitos, formação, anos de experiência, número de pacientes ou de implantes, tecnologias e equipamentos, nem nomes da equipe. Centralize tudo em `src/app/core/data/site-content.ts` com placeholders `TODO`. **No fim de cada tarefa, liste os TODOs pendentes.**

## 7. SEO (obrigatório)

- `<html lang="pt-BR">`, **um único `<h1>`** (no hero) contendo os termos principais (ex.: "Dentista em [bairro], [cidade]"), hierarquia de headings correta e HTML semântico (`header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`).
- `SeoService` usando `Title` e `Meta`: title com até ~60 caracteres, meta description com 140–160, canonical, robots, theme-color.
  - Title sugerido: `Dentista em [bairro], [cidade] | [Nome da clínica]` (ajuste o tamanho).
  - Description sugerida: "Implantes dentários, clareamento, próteses e clínica geral em [cidade]. Atendimento humanizado com [profissional]. Agende sua avaliação."
- **Open Graph** e **Twitter Card** com `public/og-image.jpg` (1200×630).
- **JSON-LD** injetado no SSR:
  - `Dentist` (tipo específico do schema.org, subtipo de `MedicalBusiness`/`LocalBusiness`) com nome, logo, imagem, endereço (`addressLocality`, `addressRegion`, `addressCountry: "BR"`, rua e CEP só com dado real), `geo`, telefone, horário (`openingHoursSpecification`), `areaServed` (bairro e cidade) e `availableService` com `MedicalProcedure` para cada tratamento confirmado;
  - `Person` (profissional responsável, `jobTitle`, `worksFor`);
  - `FAQPage` e `WebSite`.
  - Campos sem dado real ficam **fora** do schema. Sem `AggregateRating`/`Review` (ver seção 6).
- **SEO local** (crítico para consultório): nome, endereço e telefone (NAP) idênticos no site, no rodapé, no schema e no Google Business Profile. Inclua um mapa do Google com carregamento lazy (só depois de interação ou visível) e um link "Como chegar".
- `public/robots.txt` e `public/sitemap.xml` com a URL de produção (`TODO` se ainda não houver domínio).
- Favicons completos (ico, svg, apple-touch-icon, `site.webmanifest`).
- `alt` descritivo em todas as imagens de conteúdo e `alt=""` nas decorativas.
- Palavras-chave naturais: "dentista em [cidade]", "dentista [bairro]", "implante dentário [cidade]", "clareamento dental [cidade]", "dentadura", "prótese dentária", "ponte dentária", "atendimento humanizado". Sem repetição forçada.
- **Core Web Vitals**: LCP < 2,5s, CLS < 0,1, INP < 200ms. Pré-carregue a imagem e a fonte do hero e use `@defer` abaixo da dobra (sem quebrar o SSR do texto).
- Meta: Lighthouse ≥ 95 em Performance, Acessibilidade, Boas Práticas e SEO (mobile).

## 8. Acessibilidade

- WCAG 2.2 AA: contraste ≥ 4.5:1 (atenção a tons pastel em texto), foco visível, navegação completa por teclado, link "Pular para o conteúdo".
- Menu mobile acessível (`aria-expanded`, `aria-controls`, trap de foco, fechar com Esc).
- Carrossel de depoimentos navegável por teclado, com pausa no autoplay/marquee e `aria-live="polite"` desligado durante o autoplay.
- Formulário com `<label>`, erros associados (`aria-describedby`) e checkbox de consentimento **LGPD** com link para a política de privacidade. Dados de saúde são sensíveis pela LGPD: o formulário **não** pede histórico clínico, só nome, telefone, tratamento de interesse e melhor horário.

## 9. Comandos

```bash
npm install
npm start                 # ng serve
npm run build             # build de produção (com prerender)
npm run serve:ssr:<app>   # testar o SSR localmente (nome no package.json)
npx ng lint               # se configurado
```

## 10. Definição de pronto

Uma tarefa só está pronta quando:

- [ ] `npm run build` termina sem erros nem warnings novos;
- [ ] o HTML pré-renderizado (`dist/.../index.html`) contém todo o texto, as metatags e o JSON-LD;
- [ ] não há acesso a `window`/`document` no servidor;
- [ ] as animações funcionam, são destruídas corretamente e respeitam `prefers-reduced-motion`;
- [ ] o layout foi verificado em todas as larguras da seção 5;
- [ ] nada de `src/clone` foi parar no bundle;
- [ ] o texto respeita a seção 6 (CFO): CRO e EPAO visíveis, sem preço, sem promessa, depoimentos fiéis;
- [ ] a lista de TODOs de conteúdo pendente foi informada ao usuário.
