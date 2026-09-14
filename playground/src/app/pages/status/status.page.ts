import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import servicesHtml from './examples/services/services.example.html';
import * as servicesTs from './examples/services/services.example.ts' with { loader: 'text' };
import { StatusServicesExample } from './examples/services/services.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { StatusUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-status-page',
  imports: [Badge, ExampleCode, ExamplePreview, StatusServicesExample, StatusUsageExample],
  templateUrl: './status.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPage {
  protected readonly examples: Readonly<Record<'services' | 'usage', ExampleSource>> = {
    services: { html: servicesHtml, typescript: textSource(servicesTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
