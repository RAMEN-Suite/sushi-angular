import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import actionsHtml from './examples/actions/actions.example.html';
import * as actionsTs from './examples/actions/actions.example.ts' with { loader: 'text' };
import { JoinActionsExample } from './examples/actions/actions.example';
import nestedHtml from './examples/nested/nested.example.html';
import * as nestedTs from './examples/nested/nested.example.ts' with { loader: 'text' };
import { JoinNestedExample } from './examples/nested/nested.example';

@Component({
  selector: 'pg-join-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, JoinActionsExample, JoinNestedExample],
  templateUrl: './join.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinPage {
  protected readonly api: readonly ApiReferenceData[] = [apiReference.Join, apiReference.JoinItem];
  protected readonly examples: Readonly<Record<'actions' | 'nested', ExampleSource>> = {
    actions: { html: actionsHtml, typescript: textSource(actionsTs) },
    nested: { html: nestedHtml, typescript: textSource(nestedTs) },
  };
}
