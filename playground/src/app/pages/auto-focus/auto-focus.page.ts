import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import disabledHtml from './examples/disabled/disabled.example.html';
import * as disabledTs from './examples/disabled/disabled.example.ts' with { loader: 'text' };
import { AutoFocusDisabledExample } from './examples/disabled/disabled.example';
import dynamicHtml from './examples/dynamic/dynamic.example.html';
import * as dynamicTs from './examples/dynamic/dynamic.example.ts' with { loader: 'text' };
import { AutoFocusDynamicExample } from './examples/dynamic/dynamic.example';

@Component({
  selector: 'pg-auto-focus-page',
  imports: [Badge, ExampleCode, ExamplePreview, AutoFocusDisabledExample, AutoFocusDynamicExample],
  templateUrl: './auto-focus.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoFocusPage {
  protected readonly examples: Readonly<Record<'disabled' | 'dynamic', ExampleSource>> = {
    disabled: { html: disabledHtml, typescript: textSource(disabledTs) },
    dynamic: { html: dynamicHtml, typescript: textSource(dynamicTs) },
  };
}
