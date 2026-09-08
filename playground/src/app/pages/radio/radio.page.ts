import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { RadioUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-radio-page',
  imports: [Badge, ExampleCode, ExamplePreview, RadioUsageExample],
  templateUrl: './radio.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioPage {
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
