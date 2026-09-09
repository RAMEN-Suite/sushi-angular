import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import contextHtml from './examples/context/context.example.html';
import * as contextTs from './examples/context/context.example.ts' with { loader: 'text' };
import { BadgeContextExample } from './examples/context/context.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { BadgeUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-badge-page',
  imports: [Badge, BadgeContextExample, BadgeUsageExample, ExampleCode, ExamplePreview],
  templateUrl: './badge.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {
  protected readonly examples: Readonly<Record<'context' | 'usage', ExampleSource>> = {
    context: { html: contextHtml, typescript: textSource(contextTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
