import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { DrawerNavigationExample } from './examples/navigation/navigation.example';
import navigationHtml from './examples/navigation/navigation.example.html';
import * as navigationTs from './examples/navigation/navigation.example.ts' with { loader: 'text' };
import { DrawerSettingsExample } from './examples/settings/settings.example';
import settingsHtml from './examples/settings/settings.example.html';
import * as settingsTs from './examples/settings/settings.example.ts' with { loader: 'text' };
import { DrawerResponsiveExample } from './examples/responsive/responsive.example';
import responsiveHtml from './examples/responsive/responsive.example.html';
import * as responsiveTs from './examples/responsive/responsive.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-drawer-page',
  imports: [Badge, DrawerNavigationExample, DrawerResponsiveExample, DrawerSettingsExample, ExampleCode, ExamplePreview],
  templateUrl: './drawer.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPage {
  protected readonly examples: Readonly<Record<'navigation' | 'responsive' | 'settings', ExampleSource>> = {
    navigation: { html: navigationHtml, typescript: textSource(navigationTs) },
    responsive: { html: responsiveHtml, typescript: textSource(responsiveTs) },
    settings: { html: settingsHtml, typescript: textSource(settingsTs) },
  };
}
