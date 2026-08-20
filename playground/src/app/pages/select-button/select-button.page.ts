import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { SelectButtonBasicExample } from './examples/basic/basic.example';
import layoutHtml from './examples/layout/layout.example.html';
import * as layoutTs from './examples/layout/layout.example.ts' with { loader: 'text' };
import { SelectButtonLayoutExample } from './examples/layout/layout.example';
import templateHtml from './examples/template/template.example.html';
import * as templateTs from './examples/template/template.example.ts' with { loader: 'text' };
import { SelectButtonTemplateExample } from './examples/template/template.example';

@Component({
  selector: 'pg-select-button-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ExampleCode,
    SelectButtonBasicExample,
    SelectButtonLayoutExample,
    SelectButtonTemplateExample,
  ],
  templateUrl: './select-button.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButtonPage {
  protected readonly examples: Readonly<Record<'basic' | 'layout' | 'template', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    layout: { html: layoutHtml, typescript: textSource(layoutTs) },
    template: { html: templateHtml, typescript: textSource(templateTs) },
  };
}
