import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Gallery, GalleryImage } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-gallery-usage-example',
  imports: [Gallery],
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
  ];
}
