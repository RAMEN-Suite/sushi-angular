import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { type ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { TooltipUsageExample } from './examples/usage/usage.example';
import { TooltipInteractionsExample } from './examples/interactions/interactions.example';
import interactionsHtml from './examples/interactions/interactions.example.html';
import * as interactionsTs from './examples/interactions/interactions.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-tooltip-page',
  imports: [Badge, ExampleCode, ExamplePreview, TooltipUsageExample, TooltipInteractionsExample],
  templateUrl: './tooltip.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPage {
  protected readonly interactions: ExampleSource = { html: interactionsHtml, typescript: textSource(interactionsTs) };
  protected readonly example: ExampleSource = { html, typescript: textSource(ts) };
}
