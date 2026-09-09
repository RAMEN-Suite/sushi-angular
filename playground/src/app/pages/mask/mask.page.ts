import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import galleryHtml from './examples/gallery/gallery.example.html';
import * as galleryTs from './examples/gallery/gallery.example.ts' with { loader: 'text' };
import { MaskGalleryExample } from './examples/gallery/gallery.example';

@Component({
  selector: 'pg-mask-page',
  imports: [Badge, ExampleCode, ExamplePreview, MaskGalleryExample],
  templateUrl: './mask.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskPage {
  protected readonly example: ExampleSource = {
    html: galleryHtml,
    typescript: textSource(galleryTs),
  };
}
