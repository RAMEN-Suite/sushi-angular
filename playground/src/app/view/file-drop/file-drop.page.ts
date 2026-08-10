import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
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
  imports: [
    Badge,
    Card,
    CardTitle,
    ApiReference,
    ExampleCode,
    FileDropBasicExample,
    FileDropCustomExample,
    FileDropStatesExample,
  ],
  templateUrl: './file-drop.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDropPage {
  protected readonly api: ApiReferenceData = apiReference.FileDrop;

  protected readonly examples: Readonly<Record<'basic' | 'custom' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    custom: { html: customHtml, typescript: textSource(customTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
