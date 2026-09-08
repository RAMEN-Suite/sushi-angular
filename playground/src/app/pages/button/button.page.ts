import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
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
  imports: [Badge, ButtonAppearanceExample, ButtonBasicExample, ButtonStatesExample, ExampleCode, ExamplePreview],
  templateUrl: './button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'states', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
