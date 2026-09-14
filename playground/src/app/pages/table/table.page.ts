import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { TableAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { TableBasicExample } from './examples/basic/basic.example';
import mobileHtml from './examples/mobile/mobile.example.html';
import * as mobileTs from './examples/mobile/mobile.example.ts' with { loader: 'text' };
import { TableMobileExample } from './examples/mobile/mobile.example';
import simpleHtml from './examples/simple/simple.example.html';
import * as simpleTs from './examples/simple/simple.example.ts' with { loader: 'text' };
import { TableSimpleExample } from './examples/simple/simple.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { TableStatesExample } from './examples/states/states.example';
import templatesHtml from './examples/templates/templates.example.html';
import * as templatesTs from './examples/templates/templates.example.ts' with { loader: 'text' };
import { TableTemplatesExample } from './examples/templates/templates.example';

@Component({
  selector: 'pg-table-page',
  imports: [
    Badge,
    ExampleCode,
    ExamplePreview,
    TableAppearanceExample,
    TableBasicExample,
    TableMobileExample,
    TableSimpleExample,
    TableStatesExample,
    TableTemplatesExample,
  ],
  templateUrl: './table.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePage {
  protected readonly examples: Readonly<
    Record<'appearance' | 'basic' | 'mobile' | 'simple' | 'states' | 'templates', ExampleSource>
  > = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    mobile: { html: mobileHtml, typescript: textSource(mobileTs) },
    simple: { html: simpleHtml, typescript: textSource(simpleTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
    templates: { html: templatesHtml, typescript: textSource(templatesTs) },
  };
}
