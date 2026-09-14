import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { TabsBasicExample } from './examples/basic/basic.example';
import behaviorHtml from './examples/behavior/behavior.example.html';
import * as behaviorTs from './examples/behavior/behavior.example.ts' with { loader: 'text' };
import { TabsBehaviorExample } from './examples/behavior/behavior.example';
import variantsHtml from './examples/variants/variants.example.html';
import * as variantsTs from './examples/variants/variants.example.ts' with { loader: 'text' };
import { TabsVariantsExample } from './examples/variants/variants.example';

@Component({
  selector: 'pg-tabs-page',
  imports: [Badge, ExampleCode, ExamplePreview, TabsBasicExample, TabsBehaviorExample, TabsVariantsExample],
  templateUrl: './tabs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  protected readonly examples: Readonly<Record<'basic' | 'behavior' | 'variants', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    behavior: { html: behaviorHtml, typescript: textSource(behaviorTs) },
    variants: { html: variantsHtml, typescript: textSource(variantsTs) },
  };
}
