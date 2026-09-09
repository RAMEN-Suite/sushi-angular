import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { AccordionBasicExample } from './examples/basic/basic.example';
import controlHtml from './examples/control/control.example.html';
import * as controlTs from './examples/control/control.example.ts' with { loader: 'text' };
import { AccordionControlExample } from './examples/control/control.example';
import sizesHtml from './examples/sizes/sizes.example.html';
import * as sizesTs from './examples/sizes/sizes.example.ts' with { loader: 'text' };
import { AccordionSizesExample } from './examples/sizes/sizes.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { AccordionTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-accordion-page',
  imports: [
    AccordionBasicExample,
    AccordionControlExample,
    AccordionSizesExample,
    AccordionTemplatesExample,
    Badge,
    ExampleCode,
    ExamplePreview,
  ],
  templateUrl: './accordion.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionPage {
  protected readonly examples: Readonly<Record<'basic' | 'control' | 'sizes' | 'templates', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    control: { html: controlHtml, typescript: textSource(controlTs) },
    sizes: { html: sizesHtml, typescript: textSource(sizesTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
