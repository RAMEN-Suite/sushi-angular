import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, GalleryImage, Lightbox } from '@sushi-kit/angular';

@Component({
  selector: 'pg-lightbox-source-example',
  imports: [Button, Lightbox],
  templateUrl: './source.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxSourceExample {
  protected readonly image: GalleryImage = {
    value: 'chef-selection',
    src: '3.jpg',
    width: 1200,
    height: 800,
    alt: 'Salmon sashimi and assorted rolls on a large platter',
    caption: 'Sushi and sashimi platter',
  };
}
