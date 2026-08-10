import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { ToggleUsageExample } from './examples/usage/usage.example';

@Component({ selector: 'pg-toggle-page', imports: [Badge, Card, CardTitle, ExampleCode, ToggleUsageExample], templateUrl: './toggle.page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class TogglePage { protected readonly example: ExampleSource = { html: usageHtml, typescript: textSource(usageTs) }; }
