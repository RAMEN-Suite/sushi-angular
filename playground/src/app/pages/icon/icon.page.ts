import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Code, CodeLine } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { IconUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-icon-page',
  imports: [Badge, Code, CodeLine, ExampleCode, ExamplePreview, IconUsageExample],
  templateUrl: './icon.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPage {
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
