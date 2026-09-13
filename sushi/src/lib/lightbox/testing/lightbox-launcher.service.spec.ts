import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type PhotoSwipe from 'photoswipe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GalleryImage } from '../../gallery';
import { LightboxLauncher } from '../internal/lightbox-launcher.service';
import { LIGHTBOX_LOADER, LightboxLoader } from '../internal/lightbox-loader.token';

class PhotoSwipeStub {
  public readonly element: HTMLElement = document.createElement('div');
  public readonly ui: { readonly registerElement: ReturnType<typeof vi.fn> } = { registerElement: vi.fn() };
  public readonly currIndex: number = 0;
  public readonly currSlide: undefined;

  public readonly on: ReturnType<typeof vi.fn> = vi.fn();
  public readonly init: ReturnType<typeof vi.fn> = vi.fn();
  public readonly close: ReturnType<typeof vi.fn> = vi.fn();
  public readonly destroy: ReturnType<typeof vi.fn> = vi.fn();
}

const loadViewer: LightboxLoader = (): Promise<typeof PhotoSwipe> =>
  Promise.resolve(PhotoSwipeStub as unknown as typeof PhotoSwipe);
const image: GalleryImage = { value: 'menu', src: 'menu.jpg', width: 800, height: 600, alt: 'Seasonal menu' };

afterEach((): void => document.querySelectorAll('sui-lightbox').forEach((element: Element): void => element.remove()));

describe('Lightbox launcher', (): void => {
  it('replaces its dynamic Lightbox instead of stacking viewers', (): void => {
    TestBed.configureTestingModule({ providers: [{ provide: LIGHTBOX_LOADER, useValue: loadViewer }] });
    const launcher: LightboxLauncher = TestBed.inject(LightboxLauncher);
    const applicationRef: ApplicationRef = TestBed.inject(ApplicationRef);

    launcher.show(image, {
      zoom: true,
      wheelToZoom: false,
      ariaLabel: 'Menu image',
      description: 'Today’s selection',
    });
    applicationRef.tick();

    const first: HTMLElement | null = document.querySelector('sui-lightbox');
    if (!first) throw new Error('Expected a dynamic Lightbox host.');
    launcher.show(
      { ...image, value: 'next', src: 'next.jpg' },
      {
        zoom: false,
        wheelToZoom: false,
        ariaLabel: 'Next image',
        description: null,
      },
    );
    expect(document.querySelectorAll('sui-lightbox')).toHaveLength(1);
    expect(document.querySelector('sui-lightbox')).not.toBe(first);
  });
});
