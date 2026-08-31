import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
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
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { PaginationTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-pagination-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ExampleCode,
    PaginationAppearanceExample,
    PaginationBasicExample,
    PaginationCompactExample,
    PaginationTemplatesExample,
  ],
  templateUrl: './pagination.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPage {
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'compact' | 'templates', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    compact: { html: compactHtml, typescript: textSource(compactTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
