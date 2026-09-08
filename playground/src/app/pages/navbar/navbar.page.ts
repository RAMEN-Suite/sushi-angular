import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { NavbarBasicExample } from './examples/basic/basic.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { NavbarCustomExample } from './examples/custom/custom.example';
import customHtml from './examples/custom/custom.example.html';
import * as customTs from './examples/custom/custom.example.ts' with { loader: 'text' };
import { NavbarDesktopExample } from './examples/desktop/desktop.example';
import desktopHtml from './examples/desktop/desktop.example.html';
import * as desktopTs from './examples/desktop/desktop.example.ts' with { loader: 'text' };
import { NavbarOrientationsExample } from './examples/orientations/orientations.example';
import orientationsHtml from './examples/orientations/orientations.example.html';
import * as orientationsTs from './examples/orientations/orientations.example.ts' with { loader: 'text' };
import { NavbarSubmenusExample } from './examples/submenus/submenus.example';
import submenusHtml from './examples/submenus/submenus.example.html';
import * as submenusTs from './examples/submenus/submenus.example.ts' with { loader: 'text' };
import { NavbarWebsitesExample } from './examples/websites/websites.example';
import * as websitesCss from './examples/websites/websites.example.css' with { loader: 'text' };
import websitesHtml from './examples/websites/websites.example.html';
import * as websitesTs from './examples/websites/websites.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-navbar-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    NavbarBasicExample,
    NavbarCustomExample,
    NavbarDesktopExample,
    NavbarOrientationsExample,
    NavbarSubmenusExample,
    NavbarWebsitesExample,
  ],
  templateUrl: './navbar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarPage {
  protected readonly examples: Readonly<
    Record<'basic' | 'custom' | 'desktop' | 'orientations' | 'submenus' | 'websites', ExampleSource>
  > = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    custom: { html: customHtml, typescript: textSource(customTs) },
    desktop: { html: desktopHtml, typescript: textSource(desktopTs) },
    orientations: { html: orientationsHtml, typescript: textSource(orientationsTs) },
    submenus: { html: submenusHtml, typescript: textSource(submenusTs) },
    websites: { css: textSource(websitesCss), html: websitesHtml, typescript: textSource(websitesTs) },
  };
}
