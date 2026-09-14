import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { IndicatorBasicExample } from './examples/basic/basic.example';
import positionsHtml from './examples/positions/positions.example.html';
import * as positionsTs from './examples/positions/positions.example.ts' with { loader: 'text' };
import { IndicatorPositionsExample } from './examples/positions/positions.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { IndicatorUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-indicator-page',
  imports: [Badge, ExampleCode, ExamplePreview, IndicatorBasicExample, IndicatorPositionsExample, IndicatorUsageExample],
  templateUrl: './indicator.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorPage {
  protected readonly examples: Readonly<Record<'basic' | 'positions' | 'usage', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    positions: { html: positionsHtml, typescript: textSource(positionsTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
