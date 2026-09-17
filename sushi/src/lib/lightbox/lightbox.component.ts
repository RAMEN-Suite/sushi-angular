import { isPlatformBrowser } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import type PhotoSwipe from 'photoswipe';
import type { SlideData } from 'photoswipe';
import { GalleryImage } from '../gallery';
import { LIGHTBOX_LOADER, LightboxLoader } from './internal/lightbox-loader.token';

/** Opens Gallery images in a zoomable, gesture-enabled full-screen viewer powered by PhotoSwipe. */
@Component({ selector: 'sui-lightbox', exportAs: 'suiLightbox', template: '', changeDetection: ChangeDetectionStrategy.OnPush })
export class Lightbox<I extends GalleryImage = GalleryImage> {
  /** Controls and reports whether the Lightbox is open. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);
  /** Image displayed in the viewer. Width and height provide stable zoom geometry. */
  public readonly image: InputSignal<I> = input.required<I>();
  /** Optional image collection used for Gallery-style previous and next navigation. */
  public readonly images: InputSignal<readonly I[] | null> = input<readonly I[] | null>(null);
  /** Controls and reports the active image when a collection is provided. */
  public readonly activeIndex: ModelSignal<number> = model<number>(0);
  /** Accessible name for the modal viewer. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Image viewer');
  /** Optional visible description. Defaults to the image caption. */
  public readonly description: InputSignal<string | null> = input<string | null>(null);
  /** Shows the zoom control and allows zoom interactions. */
  public readonly zoom: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Lets a mouse wheel zoom the active image without requiring a modifier key. */
  public readonly wheelToZoom: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly zone: NgZone = inject(NgZone);
  private readonly platformId: object = inject(PLATFORM_ID);
  private readonly loadViewer: LightboxLoader = inject(LIGHTBOX_LOADER);
  private instance: PhotoSwipe | null = null;
  private launching: boolean = false;

  public constructor() {
    afterRenderEffect({ write: (): void => this.syncState() });
    this.destroyRef.onDestroy((): void => this.destroy());
  }

  /** Opens the Lightbox. */
  public show(): void {
    this.open.set(true);
  }

  /** Closes the Lightbox and restores focus to the previously active element. */
  public close(): void {
    this.open.set(false);
    this.instance?.close();
  }

  private syncState(): void {
    const shouldOpen: boolean = this.open();
    this.image();
    this.images();
    this.activeIndex();
    this.description();
    this.zoom();
    this.wheelToZoom();
    if (!isPlatformBrowser(this.platformId)) return;
    if (shouldOpen && !this.instance && !this.launching) void this.launch();
    else if (!shouldOpen && this.instance) this.instance.close();
  }

  private async launch(): Promise<void> {
    this.launching = true;
    const PhotoSwipeConstructor: typeof PhotoSwipe = await this.loadViewer();
    if (!this.open() || this.destroyRef.destroyed) {
      this.launching = false;
      return;
    }

    this.zone.runOutsideAngular((): void => {
      const viewer: PhotoSwipe = this.createViewer(PhotoSwipeConstructor);
      this.configureViewer(viewer);
      this.instance = viewer;
      this.launching = false;
      viewer.init();
    });
  }

  private createViewer(PhotoSwipeConstructor: typeof PhotoSwipe): PhotoSwipe {
    const configuredImages: readonly I[] | null = this.images();
    const images: readonly I[] = configuredImages?.length ? configuredImages : [this.image()];
    const index: number = Math.max(0, Math.min(this.activeIndex(), images.length - 1));
    const grouped: boolean = images.length > 1;

    return new PhotoSwipeConstructor({
      dataSource: images.map((image: I): SlideData => ({
        src: image.src,
        width: image.width,
        height: image.height,
        srcset: image.srcset,
        msrc: image.thumbnailSrc,
        alt: image.alt,
        caption: grouped ? image.caption : (this.description() ?? image.caption),
      })),
      index,
      loop: false,
      arrowPrev: grouped,
      arrowNext: grouped,
      counter: grouped,
      zoom: this.zoom(),
      wheelToZoom: this.zoom() && this.wheelToZoom(),
      ...(this.zoom()
        ? {}
        : { secondaryZoomLevel: 'fit' as const, maxZoomLevel: 'fit' as const, doubleTapAction: false, imageClickAction: false }),
      mainClass: 'sui-lightbox',
      bgOpacity: 1,
      returnFocus: true,
    });
  }

  private configureViewer(viewer: PhotoSwipe): void {
    viewer.on('afterInit', (): void => viewer.element?.setAttribute('aria-label', this.ariaLabel()));
    viewer.on('uiRegister', (): void => this.registerCaption(viewer));
    viewer.on('change', (): void => this.zone.run((): void => this.activeIndex.set(viewer.currIndex)));
    viewer.on('close', (): void => this.zone.run((): void => this.open.set(false)));
    viewer.on('destroy', (): void => {
      if (this.instance === viewer) this.instance = null;
    });
  }

  private registerCaption(viewer: PhotoSwipe): void {
    const configuredImages: readonly I[] | null = this.images();
    const images: readonly I[] = configuredImages?.length ? configuredImages : [this.image()];
    const grouped: boolean = images.length > 1;

    viewer.ui?.registerElement({
      name: 'caption',
      order: 9,
      appendTo: 'root',
      onInit: (element: HTMLElement, pswp: PhotoSwipe): void => {
        const update: () => void = (): void => {
          const image: I = images[pswp.currIndex];
          element.textContent = grouped ? (image.caption ?? '') : (this.description() ?? image.caption ?? '');
          element.hidden = element.textContent.length === 0;
        };
        pswp.on('change', update);
        update();
      },
    });
  }

  private destroy(): void {
    this.instance?.destroy();
    this.instance = null;
  }
}
