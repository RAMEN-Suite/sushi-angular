import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { GalleryUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-gallery-page',
  imports: [Badge, ExampleCode, ExamplePreview, GalleryUsageExample],
  templateUrl: './gallery.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPage {
  protected readonly example: ExampleSource = { html, typescript: textSource(ts) };
}
