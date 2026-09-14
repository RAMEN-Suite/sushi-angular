import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { PaginationAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { PaginationBasicExample } from './examples/basic/basic.example';
import compactHtml from './examples/compact/compact.example.html';
import * as compactTs from './examples/compact/compact.example.ts' with { loader: 'text' };
import { PaginationCompactExample } from './examples/compact/compact.example';

@Component({
  selector: 'pg-pagination-page',
  imports: [Badge, ExampleCode, ExamplePreview, PaginationAppearanceExample, PaginationBasicExample, PaginationCompactExample],
  templateUrl: './pagination.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPage {
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'compact', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    compact: { html: compactHtml, typescript: textSource(compactTs) },
  };
}
