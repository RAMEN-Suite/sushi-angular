import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { CheckboxUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-checkbox-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, CheckboxUsageExample],
  templateUrl: './checkbox.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxPage {
  protected readonly api: ApiReferenceData = apiReference.Checkbox;
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
