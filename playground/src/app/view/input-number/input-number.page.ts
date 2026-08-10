import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
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
  imports: [
    Badge,
    Card,
    CardTitle,
    ApiReference,
    ExampleCode,
    InputNumberBasicExample,
    InputNumberLimitsExample,
    InputNumberStatesExample,
  ],
  templateUrl: './input-number.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberPage {
  protected readonly api: ApiReferenceData = apiReference.InputNumber;

  protected readonly examples: Readonly<Record<'basic' | 'limits' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    limits: { html: limitsHtml, typescript: textSource(limitsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
