import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { Gallery, GalleryImage, Lightbox } from '@sushi-kit/angular';

@Component({
  selector: 'pg-gallery-usage-example',
  imports: [Gallery, Lightbox],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryUsageExample {
  protected readonly images: readonly GalleryImage[] = [
    {
      value: 'sushi-board',
      src: '0.jpg',
      width: 1200,
      height: 800,
      alt: 'Assorted sushi rolls served around a ceramic teapot',
      caption: 'Sushi board with tea service',
    },
    {
      value: 'homemade-maki',
      src: '1.jpg',
      width: 1200,
      height: 800,
      alt: 'Homemade cucumber, pepper, and radish maki on a blue plate',
      caption: 'Homemade maki selection',
    },
    {
      value: 'restaurant-rolls',
      src: '2.jpg',
      width: 1200,
      height: 800,
      alt: 'Colorful sushi rolls arranged on a dark slate board',
      caption: 'Restaurant roll selection',
    },
    {
      value: 'sushi-platter',
      src: '3.jpg',
      width: 1200,
      height: 800,
      alt: 'Salmon sashimi and assorted rolls on a large platter',
      caption: 'Sushi and sashimi platter',
    },
    {
      value: 'shoyu-ramen',
      src: '4.jpg',
      width: 1200,
      height: 800,
      alt: 'Shoyu ramen with chicken, egg, greens, and nori',
      caption: 'Chicken shoyu ramen',
    },
    {
      value: 'chicken-ramen',
      src: '5.jpg',
      width: 1200,
      height: 800,
      alt: 'Ramen with chicken, egg, bean sprouts, and spring onions',
      caption: 'Chicken ramen',
    },
    {
      value: 'spicy-ramen',
      src: '6.jpg',
      width: 1200,
      height: 800,
      alt: 'Spicy ramen topped with pork belly and sesame',
      caption: 'Spicy pork ramen',
    },
    {
      value: 'tantan-ramen',
      src: '7.jpg',
      width: 1200,
      height: 800,
      alt: 'Tantan ramen with peanuts, sesame, coriander, and pak choi',
      caption: 'Tantan ramen',
    },
  ];

  protected readonly activeIndex: WritableSignal<number> = signal(0);
  protected readonly activeImage: Signal<GalleryImage> = computed((): GalleryImage => this.images[this.activeIndex()]);
}
