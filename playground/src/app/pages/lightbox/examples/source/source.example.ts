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
    src: '/sushi-gallery-boat.jpg',
    width: 1536,
    height: 1024,
    alt: 'A chef selection of sushi rolls',
    caption: 'Chef selection · 18 pieces',
  };
}
