import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import type Lenis from 'lenis';

/**
 * Tempos e easings portados do clone (docs/clone-analysis.md §2), suavizados.
 */
export const DUR = { s: 0.4, m: 0.8, l: 1.2 } as const;
export const STAGGER = 0.1;
export const EASE = {
  out: 'rcOut',
  inOut: 'rcInOut',
  in: 'rcIn',
  ease: 'rcEase',
  dive: 'rcDive',
  hor: 'rcHor',
} as const;

/** Media queries avaliadas por `gsap.matchMedia()` em todas as diretivas. */
export const MQ = {
  desktop: '(min-width: 992px)',
  mobile: '(max-width: 991.98px)',
  /** Cenas fixas (sticky de 100svh): exigem largura e altura para o conteúdo caber sem corte. */
  pin: '(min-width: 992px) and (min-height: 600px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(hover: hover) and (pointer: fine)',
} as const;

export type MqConditions = Record<keyof typeof MQ, boolean>;

export interface AnimLibs {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
}

export type SetupFn = (libs: AnimLibs, c: MqConditions) => void | (() => void);

/**
 * Inicializa GSAP + ScrollTrigger + SplitText + Lenis só no navegador, sob demanda
 * (import dinâmico: as libs ficam fora do bundle inicial e não pesam no LCP).
 *
 * Regras (AGENTS.md §4): nada roda no servidor; tudo fora da zona do Angular;
 * cada diretiva usa `attach()`, que cria um `gsap.matchMedia()` revertido no DestroyRef.
 */
@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
  private readonly zone = inject(NgZone);
  private readonly document = inject(DOCUMENT);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private libs?: Promise<AnimLibs>;
  private lenis: Lenis | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly scrollListeners = new Set<(velocity: number) => void>();

  /** Carrega e configura as bibliotecas uma única vez. No servidor, nunca resolve. */
  load(): Promise<AnimLibs> {
    if (!this.isBrowser) return new Promise<AnimLibs>(() => undefined);
    this.libs ??= this.zone.runOutsideAngular(() => this.init());
    return this.libs;
  }

  /**
   * Registra uma animação ligada a um elemento. `setup` roda dentro de um
   * `gsap.matchMedia()` (re-executado quando um breakpoint/preferência muda) e
   * tudo o que ele criar (tweens, ScrollTriggers, SplitText) é revertido no destroy.
   */
  attach(scope: Element, destroyRef: DestroyRef, setup: SetupFn): void {
    if (!this.isBrowser) return;
    let destroyed = false;
    let mm: gsap.MatchMedia | undefined;
    destroyRef.onDestroy(() => {
      destroyed = true;
      mm?.revert();
    });
    void this.load().then((libs) => {
      if (destroyed) return;
      this.zone.runOutsideAngular(() => {
        mm = libs.gsap.matchMedia(scope);
        mm.add(MQ, (ctx) => setup(libs, ctx.conditions as MqConditions));
        this.scheduleRefresh();
      });
    });
  }

  /** Recalcula os gatilhos (debounce), ex.: depois de abrir um acordeão. */
  scheduleRefresh(delay = 120): void {
    if (!this.isBrowser) return;
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      void this.libs?.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, delay);
  }

  /** Velocidade do scroll (Lenis) — usada pelo selo giratório (A28). */
  onScroll(listener: (velocity: number) => void): () => void {
    this.scrollListeners.add(listener);
    return () => this.scrollListeners.delete(listener);
  }

  stopScroll(): void {
    this.lenis?.stop();
  }

  startScroll(): void {
    this.lenis?.start();
  }

  /**
   * Rola até uma seção compensando o header fixo e move o foco para ela
   * (AGENTS.md §4 — âncoras e smooth scroll).
   */
  scrollToId(id: string): boolean {
    if (!this.isBrowser) return false;
    const target = this.document.getElementById(id);
    if (!target) return false;
    const win = this.document.defaultView!;
    const rootStyle = getComputedStyle(this.document.documentElement);
    const headerH =
      parseFloat(rootStyle.getPropertyValue('--header-h')) * parseFloat(rootStyle.fontSize) || 72;
    const focusTarget = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    win.history.replaceState(null, '', `#${id}`);

    if (this.lenis) {
      // O Lenis já respeita o `scroll-padding-top` do <html> (header + respiro); só
      // compensa se ele não estiver definido.
      const padding =
        parseFloat(getComputedStyle(this.document.documentElement).scrollPaddingTop) || 0;
      this.lenis.scrollTo(target, {
        offset: padding ? 0 : -headerH,
        duration: DUR.l * 1.2,
        onComplete: focusTarget,
      });
    } else {
      const reduce = win.matchMedia(MQ.reduce).matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      focusTarget();
    }
    return true;
  }

  // -------------------------------------------------------------------------

  /**
   * Adia GSAP/ScrollTrigger/SplitText/Lenis até a primeira interação (scroll, toque, tecla,
   * ponteiro) ou, no máximo, 7s depois do load. Assim nada pesado compete com o carregamento
   * (LCP/TBT) — num celular intermediário a inicialização leva ~100–200ms e acontece
   * quando a pessoa começa a rolar, antes de chegar às seções animadas.
   */
  private whenEngaged(): Promise<void> {
    const win = this.document.defaultView!;
    const events = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    return new Promise<void>((resolve) => {
      let done = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const go = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        events.forEach((e) => win.removeEventListener(e, go));
        resolve();
      };
      events.forEach((e) => win.addEventListener(e, go, { passive: true, once: true }));
      const arm = () => (timer = setTimeout(go, 7000));
      if (this.document.readyState === 'complete') arm();
      else win.addEventListener('load', arm, { once: true });
    });
  }

  private async init(): Promise<AnimLibs> {
    await this.whenEngaged();
    const [{ gsap }, { ScrollTrigger }, { SplitText }, { CustomEase }, { default: LenisCtor }] =
      await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('gsap/CustomEase'),
        import('lenis'),
      ]);

    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

    // Easings do clone (CustomEase), com InOut suavizado.
    CustomEase.create(EASE.out, '0.25,1,0.5,1');
    CustomEase.create(EASE.inOut, '0.65,0,0.35,1');
    CustomEase.create(EASE.in, '0.5,0,0.75,0');
    CustomEase.create(EASE.ease, '0.25,0.1,0.25,1');
    CustomEase.create(EASE.dive, '0.6,0,0,1');
    CustomEase.create(EASE.hor, '0.25,0,0.75,1');
    gsap.defaults({ ease: EASE.out, duration: DUR.l });
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Smooth scroll só sem reduced-motion. No toque, rolagem nativa (syncTouch: false).
    gsap.matchMedia().add(MQ.motion, () => {
      const lenis = new LenisCtor({
        duration: DUR.l,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        autoRaf: false,
      });
      const raf = (time: number) => lenis.raf(time * 1000);
      const onScroll = (l: Lenis) => {
        ScrollTrigger.update();
        this.scrollListeners.forEach((fn) => fn(l.velocity));
      };
      lenis.on('scroll', onScroll);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      this.lenis = lenis;
      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        this.lenis = null;
      };
    });

    // Recalcula depois que fontes e imagens carregarem (AGENTS.md §4).
    void this.document.fonts?.ready.then(() => this.scheduleRefresh(0));
    const win = this.document.defaultView!;
    if (this.document.readyState !== 'complete') {
      win.addEventListener('load', () => this.scheduleRefresh(0), { once: true });
    }
    // Resize: o próprio ScrollTrigger já faz refresh com debounce.

    return { gsap, ScrollTrigger, SplitText };
  }
}
