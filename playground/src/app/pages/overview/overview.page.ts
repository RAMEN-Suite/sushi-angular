import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Card, Code, CodeLine, Tab, Tabs, TabsValue } from '@ramen-suite/sushi';
import { highlightLines } from '../../shared/example-code/example-highlighter';
import { textSource } from '../../shared/example-code/example-source';
import inviteHtml from './examples/invite/invite.example.html';
import * as inviteTs from './examples/invite/invite.example.ts' with { loader: 'text' };
import { OverviewInviteExample } from './examples/invite/invite.example';

@Component({
  selector: 'pg-overview-page',
  imports: [Card, Code, CodeLine, OverviewInviteExample, Tab, Tabs],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly showcaseHtmlLines: readonly string[] = highlightLines(inviteHtml, 'html');
  protected readonly showcaseTypescriptLines: readonly string[] = highlightLines(textSource(inviteTs), 'typescript');
  protected readonly showcaseTab: WritableSignal<TabsValue> = signal<TabsValue>('preview');
}
