import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import layoutHtml from './examples/layout/layout.example.html';
import * as layoutTs from './examples/layout/layout.example.ts' with { loader: 'text' };
import { DividerLayoutExample } from './examples/layout/layout.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { DividerUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-divider-page',
  imports: [Badge, DividerLayoutExample, DividerUsageExample, ExampleCode, ExamplePreview],
  templateUrl: './divider.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPage {
  protected readonly examples: Readonly<Record<'layout' | 'usage', ExampleSource>> = {
    layout: { html: layoutHtml, typescript: textSource(layoutTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
