import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import contextsHtml from './examples/contexts/contexts.example.html';
import * as contextsTs from './examples/contexts/contexts.example.ts' with { loader: 'text' };
import { SpinnerContextsExample } from './examples/contexts/contexts.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { SpinnerUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-spinner-page',
  imports: [Badge, ExampleCode, ExamplePreview, SpinnerContextsExample, SpinnerUsageExample],
  templateUrl: './spinner.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPage {
  protected readonly examples: Readonly<Record<'contexts' | 'usage', ExampleSource>> = {
    contexts: { html: contextsHtml, typescript: textSource(contextsTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
