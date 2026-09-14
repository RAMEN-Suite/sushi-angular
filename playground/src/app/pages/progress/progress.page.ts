import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import animationsHtml from './examples/animations/animations.example.html';
import * as animationsTs from './examples/animations/animations.example.ts' with { loader: 'text' };
import { ProgressAnimationsExample } from './examples/animations/animations.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { ProgressUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-progress-page',
  imports: [Badge, ExampleCode, ExamplePreview, ProgressAnimationsExample, ProgressUsageExample],
  templateUrl: './progress.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPage {
  protected readonly examples: Readonly<Record<'animations' | 'usage', ExampleSource>> = {
    animations: { html: animationsHtml, typescript: textSource(animationsTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
