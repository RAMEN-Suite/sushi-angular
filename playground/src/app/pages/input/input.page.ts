import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { InputAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { InputBasicExample } from './examples/basic/basic.example';
import compositionHtml from './examples/composition/composition.example.html';
import * as compositionTs from './examples/composition/composition.example.ts' with { loader: 'text' };
import { InputCompositionExample } from './examples/composition/composition.example';
import datalistHtml from './examples/datalist/datalist.example.html';
import * as datalistTs from './examples/datalist/datalist.example.ts' with { loader: 'text' };
import { InputDatalistExample } from './examples/datalist/datalist.example';
import typesHtml from './examples/native-types/native-types.example.html';
import * as typesTs from './examples/native-types/native-types.example.ts' with { loader: 'text' };
import { InputNativeTypesExample } from './examples/native-types/native-types.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { InputStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-input-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    InputAppearanceExample,
    InputBasicExample,
    InputCompositionExample,
    InputDatalistExample,
    InputNativeTypesExample,
    InputStatesExample,
  ],
  templateUrl: './input.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPage {
  protected readonly examples: Readonly<
    Record<'appearance' | 'basic' | 'composition' | 'datalist' | 'states' | 'types', ExampleSource>
  > = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    composition: { html: compositionHtml, typescript: textSource(compositionTs) },
    datalist: { html: datalistHtml, typescript: textSource(datalistTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    types: { html: typesHtml, typescript: textSource(typesTs) },
  };
}
