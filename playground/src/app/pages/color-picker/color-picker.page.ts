import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { ColorPickerBasicExample } from './examples/basic/basic.example';
import presetsHtml from './examples/presets/presets.example.html';
import * as presetsTs from './examples/presets/presets.example.ts' with { loader: 'text' };
import { ColorPickerPresetsExample } from './examples/presets/presets.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { ColorPickerStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-color-picker-page',
  imports: [Badge, Card, CardTitle, ExampleCode, ColorPickerBasicExample, ColorPickerPresetsExample, ColorPickerStatesExample],
  templateUrl: './color-picker.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerPage {
  protected readonly examples: Readonly<Record<'basic' | 'presets' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    presets: { html: presetsHtml, typescript: textSource(presetsTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
