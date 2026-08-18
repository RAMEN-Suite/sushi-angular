import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import contentHtml from './examples/content/content.example.html';
import * as contentTs from './examples/content/content.example.ts' with { loader: 'text' };
import { InputSurfaceContentExample } from './examples/content/content.example';
import searchHtml from './examples/search/search.example.html';
import * as searchTs from './examples/search/search.example.ts' with { loader: 'text' };
import { InputSurfaceSearchExample } from './examples/search/search.example';

@Component({
  selector: 'pg-input-surface-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, InputSurfaceContentExample, InputSurfaceSearchExample],
  templateUrl: './input-surface.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSurfacePage {
  protected readonly api: readonly ApiReferenceData[] = [apiReference.InputSurface, apiReference.InputSurfaceControl];
  protected readonly examples: Readonly<Record<'content' | 'search', ExampleSource>> = {
    content: { html: contentHtml, typescript: textSource(contentTs) },
    search: { html: searchHtml, typescript: textSource(searchTs) },
  };
}
