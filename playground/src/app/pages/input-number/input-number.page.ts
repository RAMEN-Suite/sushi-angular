import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { InputNumberBasicExample } from './examples/basic/basic.example';
import limitsHtml from './examples/limits/limits.example.html';
import * as limitsTs from './examples/limits/limits.example.ts' with { loader: 'text' };
import { InputNumberLimitsExample } from './examples/limits/limits.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { InputNumberStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-input-number-page',
  imports: [Badge, ExampleCode, ExamplePreview, InputNumberBasicExample, InputNumberLimitsExample, InputNumberStatesExample],
  templateUrl: './input-number.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberPage {
  protected readonly examples: Readonly<Record<'basic' | 'limits' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    limits: { html: limitsHtml, typescript: textSource(limitsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
