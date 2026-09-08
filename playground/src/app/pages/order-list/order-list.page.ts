import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { OrderListBasicExample } from './examples/basic/basic.example';
import dragDropHtml from './examples/drag-drop/drag-drop.example.html';
import * as dragDropTs from './examples/drag-drop/drag-drop.example.ts' with { loader: 'text' };
import { OrderListDragDropExample } from './examples/drag-drop/drag-drop.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { OrderListStatesExample } from './examples/states/states.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { OrderListTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-order-list-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    OrderListBasicExample,
    OrderListDragDropExample,
    OrderListStatesExample,
    OrderListTemplatesExample,
  ],
  templateUrl: './order-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListPage {
  protected readonly examples: Readonly<Record<'basic' | 'dragDrop' | 'states' | 'templates', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    dragDrop: { html: dragDropHtml, typescript: textSource(dragDropTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
