import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { BreadcrumbUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-breadcrumb-page',
  imports: [Badge, ExampleCode, ExamplePreview, BreadcrumbUsageExample],
  templateUrl: './breadcrumb.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPage {
  protected readonly example: ExampleSource = { html, typescript: textSource(ts) };
}
