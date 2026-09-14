import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { CardAppearanceExample } from './examples/appearance/appearance.example';
import contentHtml from './examples/content/content.example.html';
import * as contentTs from './examples/content/content.example.ts' with { loader: 'text' };
import { CardContentExample } from './examples/content/content.example';

@Component({
  selector: 'pg-card-page',
  imports: [Badge, CardAppearanceExample, CardContentExample, ExampleCode, ExamplePreview],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {
  protected readonly examples: Readonly<Record<'appearance' | 'content', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    content: { html: contentHtml, typescript: textSource(contentTs) },
  };
}
