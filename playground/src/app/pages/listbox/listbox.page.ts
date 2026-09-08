import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { ListboxBasicExample } from './examples/basic/basic.example';
import lazyHtml from './examples/lazy/lazy.example.html';
import * as lazyTs from './examples/lazy/lazy.example.ts' with { loader: 'text' };
import { ListboxLazyExample } from './examples/lazy/lazy.example';
import multipleHtml from './examples/multiple/multiple.example.html';
import * as multipleTs from './examples/multiple/multiple.example.ts' with { loader: 'text' };
import { ListboxMultipleExample } from './examples/multiple/multiple.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { ListboxStatesExample } from './examples/states/states.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { ListboxTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-listbox-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    ListboxBasicExample,
    ListboxLazyExample,
    ListboxMultipleExample,
    ListboxStatesExample,
    ListboxTemplatesExample,
  ],
  templateUrl: './listbox.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxPage {
  protected readonly examples: Readonly<Record<'basic' | 'lazy' | 'multiple' | 'states' | 'templates', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    lazy: { html: lazyHtml, typescript: textSource(lazyTs) },
    multiple: { html: multipleHtml, typescript: textSource(multipleTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
