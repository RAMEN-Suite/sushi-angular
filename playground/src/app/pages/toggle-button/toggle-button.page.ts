import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { ToggleButtonUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-toggle-button-page',
  imports: [Badge, ExampleCode, ExamplePreview, ToggleButtonUsageExample],
  templateUrl: './toggle-button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonPage {
  protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) };
}
