import { InjectionToken } from '@angular/core';
import type PhotoSwipe from 'photoswipe';

export type LightboxLoader = () => Promise<typeof PhotoSwipe>;

/** @internal Loads PhotoSwipe only when a Lightbox is opened in the browser. */
export const LIGHTBOX_LOADER: InjectionToken<LightboxLoader> = new InjectionToken<LightboxLoader>('SUSHI Lightbox loader', {
  providedIn: 'root',
  factory: (): LightboxLoader => async (): Promise<typeof PhotoSwipe> => (await import('photoswipe')).default,
});
