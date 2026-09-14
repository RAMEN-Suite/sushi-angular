import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { FileDropBasicExample } from './examples/basic/basic.example';
import customHtml from './examples/custom/custom.example.html';
import * as customTs from './examples/custom/custom.example.ts' with { loader: 'text' };
import { FileDropCustomExample } from './examples/custom/custom.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { FileDropStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-file-drop-page',
  imports: [Badge, ExampleCode, ExamplePreview, FileDropBasicExample, FileDropCustomExample, FileDropStatesExample],
  templateUrl: './file-drop.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropPage {
  protected readonly examples: Readonly<Record<'basic' | 'custom' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    custom: { html: customHtml, typescript: textSource(customTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
