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

/** Opens Gallery images in a zoomable, gesture-enabled full-screen viewer powered by PhotoSwipe. */
@Component({ selector: 'sui-lightbox', exportAs: 'suiLightbox', template: '', changeDetection: ChangeDetectionStrategy.OnPush })
export class Lightbox<I extends GalleryImage = GalleryImage> {
  /** Controls and reports whether the Lightbox is open. */
  public readonly open: ModelSignal<boolean> = model<boolean>(false);
  /** Image displayed in the viewer. Width and height provide stable zoom geometry. */
  public readonly image: InputSignal<I> = input.required<I>();
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
    this.description();
    this.zoom();
    this.wheelToZoom();
    if (!isPlatformBrowser(this.platformId)) return;
    if (shouldOpen && !this.instance && !this.launching) void this.launch();
    else if (!shouldOpen && this.instance) this.instance.close();
  }

  private async launch(): Promise<void> {
    const image: I = this.image();
    this.launching = true;
    const { default: PhotoSwipeConstructor } = await import('photoswipe');
    if (!this.open() || this.destroyRef.destroyed) {
      this.launching = false;
      return;
    }

    this.zone.runOutsideAngular((): void => {
      const viewer: PhotoSwipe = this.createViewer(PhotoSwipeConstructor, image);
      this.configureViewer(viewer);
      this.instance = viewer;
      this.launching = false;
      viewer.init();
    });
  }

  private createViewer(PhotoSwipeConstructor: typeof PhotoSwipe, image: I): PhotoSwipe {
    return new PhotoSwipeConstructor({
      dataSource: [
        {
          src: image.src,
          width: image.width,
          height: image.height,
          srcset: image.srcset,
          msrc: image.thumbnailSrc,
          alt: image.alt,
          caption: this.description() ?? image.caption,
        } satisfies SlideData,
      ],
      index: 0,
      loop: false,
      arrowPrev: false,
      arrowNext: false,
      counter: false,
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
    viewer.on('close', (): void => this.zone.run((): void => this.open.set(false)));
    viewer.on('destroy', (): void => {
      if (this.instance === viewer) this.instance = null;
    });
  }

  private registerCaption(viewer: PhotoSwipe): void {
    viewer.ui?.registerElement({
      name: 'caption',
      order: 9,
      appendTo: 'root',
      onInit: (element: HTMLElement, pswp: PhotoSwipe): void => {
        const update: () => void = (): void => {
          const caption: unknown = pswp.currSlide?.data['caption'];
          element.textContent = typeof caption === 'string' ? caption : '';
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
