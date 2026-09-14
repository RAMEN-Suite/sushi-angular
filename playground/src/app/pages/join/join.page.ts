import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import actionsHtml from './examples/actions/actions.example.html';
import * as actionsTs from './examples/actions/actions.example.ts' with { loader: 'text' };
import { JoinActionsExample } from './examples/actions/actions.example';
import nestedHtml from './examples/nested/nested.example.html';
import * as nestedTs from './examples/nested/nested.example.ts' with { loader: 'text' };
import { JoinNestedExample } from './examples/nested/nested.example';

@Component({
  selector: 'pg-join-page',
  imports: [Badge, ExampleCode, ExamplePreview, JoinActionsExample, JoinNestedExample],
  templateUrl: './join.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinPage {
  protected readonly examples: Readonly<Record<'actions' | 'nested', ExampleSource>> = {
    actions: { html: actionsHtml, typescript: textSource(actionsTs) },
    nested: { html: nestedHtml, typescript: textSource(nestedTs) },
  };
}
