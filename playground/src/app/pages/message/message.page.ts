import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import actionsHtml from './examples/actions/actions.example.html';
import * as actionsTs from './examples/actions/actions.example.ts' with { loader: 'text' };
import { MessageActionsExample } from './examples/actions/actions.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { MessageUsageExample } from './examples/usage/usage.example';
import verticalHtml from './examples/vertical/vertical.example.html';
import * as verticalTs from './examples/vertical/vertical.example.ts' with { loader: 'text' };
import { MessageVerticalExample } from './examples/vertical/vertical.example';

@Component({
  selector: 'pg-message-page',
  imports: [Badge, Card, CardTitle, ExampleCode, MessageActionsExample, MessageUsageExample, MessageVerticalExample],
  templateUrl: './message.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePage {
  protected readonly examples: Readonly<Record<'actions' | 'usage' | 'vertical', ExampleSource>> = {
    actions: { html: actionsHtml, typescript: textSource(actionsTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
    vertical: { html: verticalHtml, typescript: textSource(verticalTs) },
  };
}
