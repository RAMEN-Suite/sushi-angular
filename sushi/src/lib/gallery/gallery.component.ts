import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  Signal,
} from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { Button } from '../button';
import { GalleryImage } from './gallery.interfaces';

/** Browses an image collection with a large stage and accessible thumbnail navigation. */
@Component({
  selector: 'sui-gallery',
  imports: [Button, LucideChevronLeft, LucideChevronRight],
  template: `
    <figure
      class="sui-gallery"
      role="region"
      tabindex="0"
      [attr.aria-label]="ariaLabel()"
      (keydown.arrowLeft)="previous()"
      (keydown.arrowRight)="next()"
    >
      <div class="sui-gallery__stage">
        @if (selected(); as image) {
          <div class="sui-gallery__image">
            <img [src]="image.src" [attr.srcset]="image.srcset ?? null" [alt]="image.alt" />
          </div>
          @if (showNavigation() && images().length > 1) {
            <button
              suiButton
              type="button"
              class="sui-gallery__previous"
              severity="neutral"
              variant="outlined"
              shape="circle"
              [attr.aria-label]="previousLabel()"
              (click)="previous()"
            >
              <svg lucideChevronLeft aria-hidden="true"></svg>
            </button>
            <button
              suiButton
              type="button"
              class="sui-gallery__next"
              severity="neutral"
              variant="outlined"
              shape="circle"
              [attr.aria-label]="nextLabel()"
              (click)="next()"
            >
              <svg lucideChevronRight aria-hidden="true"></svg>
            </button>
          }
          <div class="sui-gallery__meta">
            <figcaption>{{ image.caption ?? image.alt }}</figcaption>
            @if (showCounter()) {
              <span>{{ activeIndex() + 1 }} / {{ images().length }}</span>
            }
          </div>
        } @else {
          <div class="sui-gallery__empty">{{ emptyLabel() }}</div>
        }
      </div>

      @if (showThumbnails() && images().length > 1) {
        <div class="sui-gallery__thumbnails" role="group" [attr.aria-label]="thumbnailLabel()">
          @for (image of images(); track image.value; let index = $index) {
            <button
              type="button"
              [class.sui-gallery__thumbnail--active]="index === activeIndex()"
              [attr.aria-current]="index === activeIndex() ? 'true' : null"
              [attr.aria-label]="image.alt"
              (click)="select(index)"
            >
              <img [src]="image.thumbnailSrc ?? image.src" alt="" />
            </button>
          }
        </div>
      }
    </figure>
  `,
  styleUrl: './gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery<I extends GalleryImage = GalleryImage> {
  /** Images available in the Gallery. */
  public readonly images: InputSignal<readonly I[]> = input.required<readonly I[]>();
  /** Controls and reports the selected image index. */
  public readonly activeIndex: ModelSignal<number> = model<number>(0);
  /** Shows previous and next actions over the stage. */
  public readonly showNavigation: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Shows the thumbnail strip below the stage. */
  public readonly showThumbnails: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Shows the current and total image count. */
  public readonly showCounter: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Wraps navigation from the last image to the first and vice versa. */
  public readonly wrap: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  /** Accessible name for the Gallery region. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Image gallery');
  /** Accessible label for the thumbnail list. */
  public readonly thumbnailLabel: InputSignal<string> = input<string>('Choose image');
  /** Accessible label for the previous action. */
  public readonly previousLabel: InputSignal<string> = input<string>('Previous image');
  /** Accessible label for the next action. */
  public readonly nextLabel: InputSignal<string> = input<string>('Next image');
  /** Text displayed when no images are available. */
  public readonly emptyLabel: InputSignal<string> = input<string>('No images available');
  protected readonly selected: Signal<I | undefined> = computed(
    (): I | undefined => this.images()[this.clamp(this.activeIndex())],
  );

  /** Selects an image by index. */
  public select(index: number): void {
    this.activeIndex.set(this.clamp(index));
  }

  /** Selects the next image. */
  public next(): void {
    this.move(1);
  }

  /** Selects the previous image. */
  public previous(): void {
    this.move(-1);
  }

  private move(step: number): void {
    const length: number = this.images().length;
    if (length < 2) return;
    const next: number = this.activeIndex() + step;
    this.select(this.wrap() ? (next + length) % length : next);
  }

  private clamp(index: number): number {
    return Math.max(0, Math.min(index, Math.max(0, this.images().length - 1)));
  }
}
