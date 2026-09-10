import { booleanAttribute, Directive, ElementRef, inject, input, InputSignal, InputSignalWithTransform } from '@angular/core';
import { GalleryImage } from '../gallery';
import { LightboxLauncher } from './internal/lightbox-launcher.service';

/** Opens one native image in a Lightbox. */
@Directive({
  selector: 'img[suiLightbox]',
  host: {
    class: 'sui-lightbox-trigger',
    role: 'button',
    tabindex: '0',
    '(click)': 'show()',
    '(keydown.enter)': 'show()',
    '(keydown.space)': 'handleSpace($event)',
  },
})
export class LightboxTrigger<I extends GalleryImage = GalleryImage> {
  /** Optional image metadata. Omit the value to open the native image source directly. */
  public readonly suiLightbox: InputSignal<I | ''> = input<I | ''>('');
  /** Shows the zoom control and allows zoom interactions. */
  public readonly zoom: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Lets a mouse wheel zoom the active image without requiring a modifier key. */
  public readonly wheelToZoom: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  /** Accessible name for the modal viewer. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Image viewer');
  /** Optional visible description. Defaults to the metadata caption. */
  public readonly description: InputSignal<string | null> = input<string | null>(null);

  private readonly launcher: LightboxLauncher = inject(LightboxLauncher);
  private readonly element: ElementRef<HTMLImageElement> = inject<ElementRef<HTMLImageElement>>(ElementRef);

  /** Opens the configured image. */
  public show(): void {
    const source: I | '' = this.suiLightbox();
    this.launcher.show(source === '' ? this.nativeImage() : source, {
      zoom: this.zoom(),
      wheelToZoom: this.wheelToZoom(),
      ariaLabel: this.ariaLabel(),
      description: this.description(),
    });
  }

  protected handleSpace(event: Event): void {
    event.preventDefault();
    this.show();
  }

  private nativeImage(): GalleryImage {
    const image: HTMLImageElement = this.element.nativeElement;
    return {
      value: image.currentSrc || image.src,
      src: image.currentSrc || image.src,
      width: image.naturalWidth || image.width || 1,
      height: image.naturalHeight || image.height || 1,
      alt: image.alt,
    };
  }
}
