import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { IconUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-icon-page',
  imports: [Badge, Card, CardTitle, ExampleCode, IconUsageExample],
  templateUrl: './icon.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPage {
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
