import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { ToastUsageExample } from './examples/usage/usage.example';
import customHtml from './examples/custom/custom.example.html';
import * as customTs from './examples/custom/custom.example.ts' with { loader: 'text' };
import { ToastCustomExample } from './examples/custom/custom.example';

@Component({
  selector: 'pg-toast-page',
  imports: [Badge, ExampleCode, ExamplePreview, ToastCustomExample, ToastUsageExample],
  templateUrl: './toast.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastPage {
  protected readonly example: ExampleSource = {
    html: usageHtml,
    typescript: textSource(usageTs),
  };
  protected readonly customExample: ExampleSource = {
    html: customHtml,
    typescript: textSource(customTs),
  };
}
