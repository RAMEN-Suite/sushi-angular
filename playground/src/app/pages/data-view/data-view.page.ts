import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { DataViewBasicExample } from './examples/basic/basic.example';
import infiniteHtml from './examples/infinite/infinite.example.html';
import * as infiniteTs from './examples/infinite/infinite.example.ts' with { loader: 'text' };
import { DataViewInfiniteExample } from './examples/infinite/infinite.example';
import layoutHtml from './examples/layout/layout.example.html';
import * as layoutTs from './examples/layout/layout.example.ts' with { loader: 'text' };
import { DataViewLayoutExample } from './examples/layout/layout.example';
import paginationHtml from './examples/pagination/pagination.example.html';
import * as paginationTs from './examples/pagination/pagination.example.ts' with { loader: 'text' };
import { DataViewPaginationExample } from './examples/pagination/pagination.example';
import remoteHtml from './examples/remote/remote.example.html';
import * as remoteTs from './examples/remote/remote.example.ts' with { loader: 'text' };
import { DataViewRemoteExample } from './examples/remote/remote.example';

@Component({
  selector: 'pg-data-view-page',
  imports: [
    Badge,
    DataViewBasicExample,
    DataViewInfiniteExample,
    DataViewLayoutExample,
    DataViewPaginationExample,
    DataViewRemoteExample,
    ExampleCode,
    ExamplePreview,
  ],
  templateUrl: './data-view.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewPage {
  protected readonly examples: Readonly<Record<'basic' | 'infinite' | 'layout' | 'pagination' | 'remote', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    infinite: { html: infiniteHtml, typescript: textSource(infiniteTs) },
    layout: { html: layoutHtml, typescript: textSource(layoutTs) },
    pagination: { html: paginationHtml, typescript: textSource(paginationTs) },
    remote: { html: remoteHtml, typescript: textSource(remoteTs) },
  };
}
