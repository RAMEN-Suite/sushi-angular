import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { ChipBasicExample } from './examples/basic/basic.example';
import colorsHtml from './examples/colors/colors.example.html';
import * as colorsTs from './examples/colors/colors.example.ts' with { loader: 'text' };
import { ChipColorsExample } from './examples/colors/colors.example';
import appearanceHtml from './examples/appearance/appearance.example.html';
import * as appearanceTs from './examples/appearance/appearance.example.ts' with { loader: 'text' };
import { ChipAppearanceExample } from './examples/appearance/appearance.example';
import iconHtml from './examples/icon/icon.example.html';
import * as iconTs from './examples/icon/icon.example.ts' with { loader: 'text' };
import { ChipIconExample } from './examples/icon/icon.example';
import imageHtml from './examples/image/image.example.html';
import * as imageTs from './examples/image/image.example.ts' with { loader: 'text' };
import { ChipImageExample } from './examples/image/image.example';
import removalHtml from './examples/removal/removal.example.html';
import * as removalTs from './examples/removal/removal.example.ts' with { loader: 'text' };
import { ChipRemovalExample } from './examples/removal/removal.example';
import templateHtml from './examples/template/template.example.html';
import * as templateTs from './examples/template/template.example.ts' with { loader: 'text' };
import { ChipTemplateExample } from './examples/template/template.example';

@Component({
  selector: 'pg-chip-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ChipAppearanceExample,
    ChipBasicExample,
    ChipColorsExample,
    ChipIconExample,
    ChipImageExample,
    ChipRemovalExample,
    ChipTemplateExample,
    ExampleCode,
  ],
  templateUrl: './chip.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipPage {
  protected readonly examples: Readonly<
    Record<'appearance' | 'basic' | 'colors' | 'icon' | 'image' | 'removal' | 'template', ExampleSource>
  > = {
    appearance: { html: appearanceHtml, typescript: textSource(appearanceTs) },
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    colors: { html: colorsHtml, typescript: textSource(colorsTs) },
    icon: { html: iconHtml, typescript: textSource(iconTs) },
    image: { html: imageHtml, typescript: textSource(imageTs) },
    removal: { html: removalHtml, typescript: textSource(removalTs) },
    template: { html: templateHtml, typescript: textSource(templateTs) },
  };
}
