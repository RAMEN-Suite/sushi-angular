import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { LabelBasicExample } from './examples/basic/basic.example';

@Component({
  selector: 'pg-label-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, LabelBasicExample],
  templateUrl: './label.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelPage {
  protected readonly api: ApiReferenceData = apiReference.Label;
  protected readonly example: ExampleSource = { html: basicHtml, typescript: textSource(basicTs) };
}
