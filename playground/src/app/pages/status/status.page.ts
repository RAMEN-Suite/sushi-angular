import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import servicesHtml from './examples/services/services.example.html';
import * as servicesTs from './examples/services/services.example.ts' with { loader: 'text' };
import { StatusServicesExample } from './examples/services/services.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { StatusUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-status-page',
  imports: [ApiReference, Badge, Card, CardTitle, ExampleCode, StatusServicesExample, StatusUsageExample],
  templateUrl: './status.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPage {
  protected readonly api: ApiReferenceData = apiReference.Status;
  protected readonly examples: Readonly<Record<'services' | 'usage', ExampleSource>> = {
    services: { html: servicesHtml, typescript: textSource(servicesTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
