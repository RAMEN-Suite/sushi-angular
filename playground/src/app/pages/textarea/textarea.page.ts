import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { TextareaAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { TextareaBasicExample } from './examples/basic/basic.example';
import resizeHtml from './examples/resize/resize.example.html';
import * as resizeTs from './examples/resize/resize.example.ts' with { loader: 'text' };
import { TextareaResizeExample } from './examples/resize/resize.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { TextareaStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-textarea-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    TextareaAppearanceExample,
    TextareaBasicExample,
    TextareaResizeExample,
    TextareaStatesExample,
  ],
  templateUrl: './textarea.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaPage {
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'resize' | 'states', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    resize: { html: resizeHtml, typescript: textSource(resizeTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
