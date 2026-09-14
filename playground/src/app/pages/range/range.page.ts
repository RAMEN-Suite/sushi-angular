import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { RangeAppearanceExample } from './examples/appearance/appearance.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { RangeBasicExample } from './examples/basic/basic.example';
import mixerHtml from './examples/mixer/mixer.example.html';
import * as mixerTs from './examples/mixer/mixer.example.ts' with { loader: 'text' };
import { RangeMixerExample } from './examples/mixer/mixer.example';

@Component({
  selector: 'pg-range-page',
  imports: [Badge, ExampleCode, ExamplePreview, RangeAppearanceExample, RangeBasicExample, RangeMixerExample],
  templateUrl: './range.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangePage {
  protected readonly examples: Readonly<Record<'appearance' | 'basic' | 'mixer', ExampleSource>> = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    mixer: { html: mixerHtml, typescript: textSource(mixerTs) },
  };
}
