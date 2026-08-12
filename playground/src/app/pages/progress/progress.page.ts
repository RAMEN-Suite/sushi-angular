import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { ProgressUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-progress-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, ProgressUsageExample],
  templateUrl: './progress.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPage {
  protected readonly api: ApiReferenceData = apiReference.Progress;
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
