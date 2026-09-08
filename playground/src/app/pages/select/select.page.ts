import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { SelectBasicExample } from './examples/basic/basic.example';
import behaviorHtml from './examples/behavior/behavior.example.html';
import * as behaviorTs from './examples/behavior/behavior.example.ts' with { loader: 'text' };
import { SelectBehaviorExample } from './examples/behavior/behavior.example';
import optionsHtml from './examples/options/options.example.html';
import * as optionsTs from './examples/options/options.example.ts' with { loader: 'text' };
import { SelectOptionsExample } from './examples/options/options.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { SelectStatesExample } from './examples/states/states.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { SelectTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-select-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    SelectBasicExample,
    SelectBehaviorExample,
    SelectOptionsExample,
    SelectStatesExample,
    SelectTemplatesExample,
  ],
  templateUrl: './select.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPage {
  protected readonly examples: Readonly<Record<'basic' | 'behavior' | 'options' | 'states' | 'templates', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    behavior: { html: behaviorHtml, typescript: textSource(behaviorTs) },
    options: { html: optionsHtml, typescript: textSource(optionsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
