import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownDocument } from '../../shared/markdown-document/markdown-document.component';
import { ThemeTokenTable } from './theme-token-table/theme-token-table.component';

interface ContributorPageData {
  readonly description: string;
  readonly source: string;
  readonly title: string;
  readonly themeTokens?: boolean;
}

const DOCUMENT_ROUTES: Readonly<Record<string, string>> = {
  'CONTRIBUTING.md': '/contribute',
  'getting-started.md': '/getting-started',
  'styling-and-themes.md': '/styling-and-themes',
  'component-development.md': '/contribute/components',
  'component-styling.md': '/contribute/styles',
  'coding-conventions.md': '/contribute/code',
  'testing-conventions.md': '/contribute/testing',
  'ai-conventions.md': '/contribute/ai',
};

@Component({
  selector: 'pg-contributor-page',
  imports: [MarkdownDocument, ThemeTokenTable],
  templateUrl: './contributor.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorPage {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  protected readonly page: ContributorPageData = this.route.snapshot.data as ContributorPageData;

  protected openDocument(href: string): void {
    const fileName: string | undefined = href.split('/').at(-1);
    const route: string | undefined = fileName ? DOCUMENT_ROUTES[fileName] : undefined;
    if (route === undefined) return;

    void this.router.navigateByUrl(route);
  }
}
