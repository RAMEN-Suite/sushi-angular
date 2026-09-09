import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { CodeBasicExample } from './examples/basic/basic.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { CodeTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-code-page',
  imports: [Badge, CodeBasicExample, CodeTemplatesExample, ExampleCode, ExamplePreview],
  templateUrl: './code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePage {
  protected readonly examples: Readonly<Record<'basic' | 'templates', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
