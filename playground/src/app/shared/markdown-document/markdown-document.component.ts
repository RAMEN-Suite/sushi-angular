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
import { Spinner } from '@sushi-kit/angular';
import { marked } from 'marked';

@Component({
  selector: 'pg-markdown-document',
  imports: [Spinner],
  templateUrl: './markdown-document.component.html',
  host: {
    '(click)': 'handleDocumentClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownDocument {
  public readonly source: InputSignal<string> = input.required<string>();
  public readonly documentLink: OutputEmitterRef<string> = output<string>();

  protected readonly document: ResourceRef<string | undefined> = resource({
    params: (): string => this.source(),
    loader: async ({ params, abortSignal }): Promise<string> => {
      const response: Response = await fetch(params, { signal: abortSignal });
      if (!response.ok) throw new Error(`Could not load ${params}.`);

      return marked.parse(await response.text(), { async: false });
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
