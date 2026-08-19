import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { CardAppearanceExample } from './examples/appearance/appearance.example';
import contentHtml from './examples/content/content.example.html';
import * as contentTs from './examples/content/content.example.ts' with { loader: 'text' };
import { CardContentExample } from './examples/content/content.example';

@Component({
  selector: 'pg-card-page',
  imports: [ApiReference, Badge, Card, CardAppearanceExample, CardContentExample, CardTitle, ExampleCode],
  templateUrl: './card.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {
  protected readonly api: readonly ApiReferenceData[] = [
    apiReference.Card,
    apiReference.CardTitle,
    apiReference.CardMedia,
    apiReference.CardActions,
  ];
  protected readonly examples: Readonly<Record<'appearance' | 'content', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    content: { html: contentHtml, typescript: textSource(contentTs) },
  };
}
