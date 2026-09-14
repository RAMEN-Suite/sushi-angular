import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { SkeletonUsageExample } from './examples/usage/usage.example';
import cardHtml from './examples/card/card.example.html';
import * as cardTs from './examples/card/card.example.ts' with { loader: 'text' };
import { SkeletonCardExample } from './examples/card/card.example';
import listHtml from './examples/list/list.example.html';
import * as listTs from './examples/list/list.example.ts' with { loader: 'text' };
import { SkeletonListExample } from './examples/list/list.example';
@Component({
  selector: 'pg-skeleton-page',
  imports: [Badge, ExampleCode, ExamplePreview, SkeletonCardExample, SkeletonListExample, SkeletonUsageExample],
  templateUrl: './skeleton.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonPage {
  protected readonly examples: Readonly<Record<'card' | 'list' | 'usage', ExampleSource>> = {
    card: { html: cardHtml, typescript: textSource(cardTs) },
    list: { html: listHtml, typescript: textSource(listTs) },
    usage: { html, typescript: textSource(ts) },
  };
}
