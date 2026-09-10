import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { PopoverUsageExample } from './examples/usage/usage.example';
import selectionHtml from './examples/selection/selection.example.html';
import * as selectionTs from './examples/selection/selection.example.ts' with { loader: 'text' };
import { PopoverSelectionExample } from './examples/selection/selection.example';
import targetHtml from './examples/target/target.example.html';
import * as targetTs from './examples/target/target.example.ts' with { loader: 'text' };
import { PopoverTargetExample } from './examples/target/target.example';
@Component({
  selector: 'pg-popover-page',
  imports: [Badge, ExampleCode, ExamplePreview, PopoverSelectionExample, PopoverTargetExample, PopoverUsageExample],
  templateUrl: './popover.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPage {
  protected readonly examples: Readonly<Record<'selection' | 'target' | 'usage', ExampleSource>> = {
    selection: { html: selectionHtml, typescript: textSource(selectionTs) },
    target: { html: targetHtml, typescript: textSource(targetTs) },
    usage: { html, typescript: textSource(ts) },
  };
}
