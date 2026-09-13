import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { Gallery, GalleryImage, Lightbox } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-gallery-usage-example',
  imports: [Gallery, Lightbox],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryUsageExample {
  protected readonly images: readonly GalleryImage[] = [
    {
      value: 'nigiri',
      src: '/sushi-gallery-nigiri.jpg',
      width: 1536,
      height: 1024,
      alt: 'Assorted nigiri arranged on a dark plate',
      caption: 'Chef’s nigiri selection',
    },
    {
      value: 'rolls',
      src: '/sushi-gallery-boat.jpg',
      width: 1536,
      height: 1024,
      alt: 'Colorful sushi rolls on a serving board',
      caption: 'Seasonal maki rolls',
    },
    {
      value: 'salmon',
      src: '/sushi-gallery-salmon.jpg',
      width: 1536,
      height: 1024,
      alt: 'Salmon sushi served with ginger and wasabi',
      caption: 'Salmon set with fresh wasabi',
    },
    {
      value: 'tuna',
      src: '/sushi-gallery-tuna.png',
      width: 1536,
      height: 1024,
      alt: 'Tuna sashimi and nigiri on dark ceramic plates',
      caption: 'Tuna tasting course',
    },
    {
      value: 'temaki',
      src: '/sushi-gallery-temaki.png',
      width: 1536,
      height: 1024,
      alt: 'Three temaki hand rolls in a ceramic holder',
      caption: 'Temaki trio',
    },
    {
      value: 'omakase',
      src: '/sushi-gallery-omakase.png',
      width: 1536,
      height: 1024,
      alt: 'Scallop, prawn, and white fish nigiri on a ceramic plate',
      caption: 'Omakase selection',
    },
    {
      value: 'chirashi',
      src: '/sushi-gallery-chirashi.png',
      width: 1536,
      height: 1024,
      alt: 'Chirashi bowl with salmon, tuna, egg, and cucumber',
      caption: 'Morning chirashi bowl',
    },
    {
      value: 'vegetarian',
      src: '/sushi-gallery-vegetarian.png',
      width: 1536,
      height: 1024,
      alt: 'Vegetarian maki with avocado, cucumber, and radish',
      caption: 'Garden maki',
    },
  ];

  protected readonly activeIndex: WritableSignal<number> = signal(0);
  protected readonly activeImage: Signal<GalleryImage> = computed((): GalleryImage => this.images[this.activeIndex()]);
}
