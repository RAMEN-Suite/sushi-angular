import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Mask, MaskShape } from '@sushi-kit/angular';

@Component({
  selector: 'pg-mask-gallery-example',
  imports: [Mask],
  templateUrl: './gallery.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskGalleryExample {
  protected readonly shapes: readonly MaskShape[] = [
    'squircle',
    'heart',
    'hexagon',
    'hexagon-2',
    'decagon',
    'pentagon',
    'diamond',
    'square',
    'circle',
    'star',
    'star-2',
    'triangle',
    'triangle-2',
    'triangle-3',
    'triangle-4',
  ];
}
