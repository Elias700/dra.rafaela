import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/** Larguras geradas por scripts/optimize-images.mjs */
const IMAGE_WIDTHS = [320, 480, 640, 960];

/** Loader do NgOptimizedImage: `ngSrc="foto-hero"` → /images/foto-hero-<largura>.webp */
const imageLoader = (config: ImageLoaderConfig): string => {
  const width =
    IMAGE_WIDTHS.find((w) => w >= (config.width ?? 0)) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `/images/${config.src}-${width}.webp`;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    { provide: IMAGE_LOADER, useValue: imageLoader },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: IMAGE_WIDTHS, placeholderResolution: 30 } },
  ],
};
