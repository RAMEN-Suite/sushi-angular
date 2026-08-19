import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { ButtonAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { ButtonBasicExample } from './examples/basic/basic.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { ButtonStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-button-page',
  imports: [ApiReference, Badge, ButtonAppearanceExample, ButtonBasicExample, ButtonStatesExample, Card, CardTitle, ExampleCode],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  protected readonly api: ApiReferenceData = apiReference.Button;
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'states', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
