import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Card, Code, CodeLine, Tab, Tabs, TabsValue } from '@sushi-kit/angular';
import { highlightLines } from '../../shared/example-code/example-highlighter';
import { textSource } from '../../shared/example-code/example-source';
import inviteHtml from './examples/invite/invite.example.html';
import * as inviteTs from './examples/invite/invite.example.ts' with { loader: 'text' };
import { OverviewInviteExample } from './examples/invite/invite.example';
import { MarkdownDocument } from '../../shared/markdown-document/markdown-document.component';

interface ContributorGuide {
  readonly label: string;
  readonly source: string;
  readonly value: string;
}

@Component({
  selector: 'pg-overview-page',
  imports: [Card, Code, CodeLine, MarkdownDocument, OverviewInviteExample, Tab, Tabs],
  templateUrl: './overview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  protected readonly showcaseHtmlLines: readonly string[] = highlightLines(inviteHtml, 'html');
  protected readonly showcaseTypescriptLines: readonly string[] = highlightLines(textSource(inviteTs), 'typescript');
  protected readonly showcaseTab: WritableSignal<TabsValue> = signal<TabsValue>('preview');
  protected readonly guideTab: WritableSignal<TabsValue> = signal<TabsValue>('contributing');
  protected readonly guides: readonly ContributorGuide[] = [
    { label: 'Contributing', source: '/repository-docs/CONTRIBUTING.md', value: 'contributing' },
    { label: 'Components', source: '/repository-docs/component-development.md', value: 'components' },
    { label: 'Code', source: '/repository-docs/coding-conventions.md', value: 'code' },
    { label: 'Testing', source: '/repository-docs/testing-conventions.md', value: 'testing' },
    { label: 'AI', source: '/repository-docs/ai-conventions.md', value: 'ai' },
  ];

  protected openGuide(href: string): void {
    const fileName: string | undefined = href.split('/').at(-1);
    const guide: ContributorGuide | undefined = this.guides.find((candidate: ContributorGuide): boolean =>
      candidate.source.endsWith(`/${fileName}`),
    );
    if (guide === undefined) return;

    this.guideTab.set(guide.value);
  }
}
