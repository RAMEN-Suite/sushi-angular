import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { FileInputBasicExample } from './examples/basic/basic.example';
import nativeHtml from './examples/native/native.example.html';
import * as nativeTs from './examples/native/native.example.ts' with { loader: 'text' };
import { FileInputNativeExample } from './examples/native/native.example';
import optionsHtml from './examples/options/options.example.html';
import * as optionsTs from './examples/options/options.example.ts' with { loader: 'text' };
import { FileInputOptionsExample } from './examples/options/options.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { FileInputStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-file-input-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ExampleCode,
    FileInputBasicExample,
    FileInputNativeExample,
    FileInputOptionsExample,
    FileInputStatesExample,
  ],
  templateUrl: './file-input.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputPage {
  protected readonly examples: Readonly<Record<'basic' | 'native' | 'options' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    native: { html: nativeHtml, typescript: textSource(nativeTs) },
    options: { html: optionsHtml, typescript: textSource(optionsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
