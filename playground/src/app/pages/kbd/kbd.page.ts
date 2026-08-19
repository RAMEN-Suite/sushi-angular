import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import hotkeysHtml from './examples/hotkeys/hotkeys.example.html';
import * as hotkeysTs from './examples/hotkeys/hotkeys.example.ts' with { loader: 'text' };
import { KbdHotkeysExample } from './examples/hotkeys/hotkeys.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { KbdUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-kbd-page',
  imports: [ApiReference, Badge, Card, CardTitle, ExampleCode, KbdHotkeysExample, KbdUsageExample],
  templateUrl: './kbd.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdPage {
  protected readonly api: ApiReferenceData = apiReference.Kbd;
  protected readonly examples: Readonly<Record<'hotkeys' | 'usage', ExampleSource>> = {
    hotkeys: { html: hotkeysHtml, typescript: textSource(hotkeysTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
