import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import hotkeysHtml from './examples/hotkeys/hotkeys.example.html';
import * as hotkeysTs from './examples/hotkeys/hotkeys.example.ts' with { loader: 'text' };
import { KbdHotkeysExample } from './examples/hotkeys/hotkeys.example';
import usageHtml from './examples/usage/usage.example.html';
import * as usageTs from './examples/usage/usage.example.ts' with { loader: 'text' };
import { KbdUsageExample } from './examples/usage/usage.example';

@Component({
  selector: 'pg-kbd-page',
  imports: [Badge, ExampleCode, ExamplePreview, KbdHotkeysExample, KbdUsageExample],
  templateUrl: './kbd.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdPage {
  protected readonly examples: Readonly<Record<'hotkeys' | 'usage', ExampleSource>> = {
    hotkeys: { html: hotkeysHtml, typescript: textSource(hotkeysTs) },
    usage: { html: usageHtml, typescript: textSource(usageTs) },
  };
}
