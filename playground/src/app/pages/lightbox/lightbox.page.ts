import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import html from './examples/usage/usage.example.html';
import * as ts from './examples/usage/usage.example.ts' with { loader: 'text' };
import { LightboxUsageExample } from './examples/usage/usage.example';
import sourceHtml from './examples/source/source.example.html';
import * as sourceTs from './examples/source/source.example.ts' with { loader: 'text' };
import { LightboxSourceExample } from './examples/source/source.example';
import settingsHtml from './examples/settings/settings.example.html';
import * as settingsTs from './examples/settings/settings.example.ts' with { loader: 'text' };
import { LightboxSettingsExample } from './examples/settings/settings.example';
@Component({
  selector: 'pg-lightbox-page',
  imports: [Badge, ExampleCode, ExamplePreview, LightboxSettingsExample, LightboxSourceExample, LightboxUsageExample],
  templateUrl: './lightbox.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxPage {
  protected readonly examples: Readonly<Record<'settings' | 'source' | 'usage', ExampleSource>> = {
    settings: { html: settingsHtml, typescript: textSource(settingsTs) },
    source: { html: sourceHtml, typescript: textSource(sourceTs) },
    usage: { html, typescript: textSource(ts) },
  };
}
