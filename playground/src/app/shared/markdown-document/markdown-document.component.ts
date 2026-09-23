import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  ResourceRef,
  resource,
} from '@angular/core';
import {
  Code,
  CodeLine,
  Spinner,
  Table,
  TableAlignment,
  TableCellTemplate,
  TableColumn,
  TableHeaderTemplate,
} from '@sushi-kit/angular';
import { marked } from 'marked';
import type { Token, Tokens } from 'marked';
import { highlightLines } from '../example-code/example-highlighter';
import type { CodeLanguage } from '../example-code/example-highlighter';

interface MarkdownHtmlBlock {
  readonly kind: 'html';
  readonly html: string;
}

interface MarkdownCodeBlock {
  readonly kind: 'code';
  readonly lines: readonly string[];
}

interface MarkdownTableRow {
  readonly cells: readonly string[];
}

interface MarkdownTableBlock {
  readonly kind: 'table';
  readonly columns: readonly TableColumn<MarkdownTableRow>[];
  readonly rows: readonly MarkdownTableRow[];
}

type MarkdownBlock = MarkdownCodeBlock | MarkdownHtmlBlock | MarkdownTableBlock;

const CODE_LANGUAGES: Readonly<Record<string, CodeLanguage>> = {
  bash: 'bash',
  css: 'css',
  html: 'html',
  json: 'json',
  sh: 'bash',
  shell: 'bash',
  text: 'text',
  ts: 'typescript',
  typescript: 'typescript',
};

@Component({
  selector: 'pg-markdown-document',
  imports: [Code, CodeLine, Spinner, Table, TableCellTemplate, TableHeaderTemplate],
  templateUrl: './markdown-document.component.html',
  host: {
    class: 'block min-w-0 max-w-full',
    '(click)': 'handleDocumentClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownDocument {
  public readonly source: InputSignal<string> = input.required<string>();
  public readonly documentLink: OutputEmitterRef<string> = output<string>();

  protected readonly document: ResourceRef<readonly MarkdownBlock[] | undefined> = resource({
    params: (): string => this.source(),
    loader: async ({ params, abortSignal }): Promise<readonly MarkdownBlock[]> => {
      const sourceUrl: URL = new URL(params.replace(/^\/+/, ''), document.baseURI);
      const response: Response = await fetch(sourceUrl, { signal: abortSignal });
      if (!response.ok) throw new Error(`Could not load ${params}.`);

      return parseMarkdown(await response.text());
    },
  });

  protected handleDocumentClick(event: MouseEvent): void {
    const target: Element | null = event.target instanceof Element ? event.target : null;
    const link: HTMLAnchorElement | null = target?.closest<HTMLAnchorElement>('a') ?? null;
    const href: string | null = link?.getAttribute('href') ?? null;
    if (!href?.endsWith('.md')) return;

    event.preventDefault();
    this.documentLink.emit(href);
  }
}

function parseMarkdown(source: string): readonly MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let prose: Token[] = [];

  const appendProse: () => void = (): void => {
    if (prose.length === 0) return;

    blocks.push({ kind: 'html', html: marked.parser(prose) });
    prose = [];
  };

  marked.lexer(source).forEach((token: Token): void => {
    switch (token.type) {
      case 'code':
        appendProse();
        blocks.push(createCodeBlock(token as Tokens.Code));
        break;
      case 'table':
        appendProse();
        blocks.push(createTableBlock(token as Tokens.Table));
        break;
      default:
        prose.push(token);
    }
  });

  appendProse();
  return blocks;
}

function createCodeBlock(token: Tokens.Code): MarkdownBlock {
  const language: CodeLanguage = CODE_LANGUAGES[token.lang?.toLowerCase() ?? ''] ?? 'text';

  return {
    kind: 'code',
    lines: highlightLines(token.text, language),
  };
}

function createTableBlock(token: Tokens.Table): MarkdownTableBlock {
  const columns: readonly TableColumn<MarkdownTableRow>[] = token.header.map(
    (cell: Tokens.TableCell, index: number): TableColumn<MarkdownTableRow> => ({
      key: `column-${index}`,
      header: marked.Parser.parseInline(cell.tokens),
      align: tableAlignment(token.align[index]),
      value: (row: MarkdownTableRow): string => row.cells[index] ?? '',
    }),
  );

  const rows: readonly MarkdownTableRow[] = token.rows.map((row: Tokens.TableCell[]): MarkdownTableRow => ({
    cells: row.map((cell: Tokens.TableCell): string => marked.Parser.parseInline(cell.tokens)),
  }));

  return { kind: 'table', columns, rows };
}

function tableAlignment(alignment: 'center' | 'left' | 'right' | null | undefined): TableAlignment {
  if (alignment === 'center') return 'center';
  if (alignment === 'right') return 'end';
  return 'start';
}
