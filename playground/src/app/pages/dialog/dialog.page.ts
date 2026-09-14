import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import { DialogAdvancedExample } from './examples/advanced/advanced.example';
import * as advancedCss from './examples/advanced/advanced.example.css' with { loader: 'text' };
import advancedHtml from './examples/advanced/advanced.example.html';
import * as advancedTs from './examples/advanced/advanced.example.ts' with { loader: 'text' };
import { DialogBasicExample } from './examples/basic/basic.example';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { DialogFormExample } from './examples/form/form.example';
import * as formCss from './examples/form/form.example.css' with { loader: 'text' };
import formHtml from './examples/form/form.example.html';
import * as formTs from './examples/form/form.example.ts' with { loader: 'text' };
import { DialogDynamicExample } from './examples/dynamic/dynamic.example';
import dynamicHtml from './examples/dynamic/dynamic.example.html';
import * as dynamicTs from './examples/dynamic/dynamic.example.ts' with { loader: 'text' };

@Component({
  selector: 'pg-dialog-page',
  imports: [
    Badge,
    DialogAdvancedExample,
    DialogBasicExample,
    DialogDynamicExample,
    DialogFormExample,
    ExampleCode,
    ExamplePreview,
  ],
  templateUrl: './dialog.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPage {
  protected readonly examples: Readonly<Record<'advanced' | 'basic' | 'dynamic' | 'form', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    advanced: { css: textSource(advancedCss), html: advancedHtml, typescript: textSource(advancedTs) },
    form: { css: textSource(formCss), html: formHtml, typescript: textSource(formTs) },
    dynamic: { html: dynamicHtml, typescript: textSource(dynamicTs) },
  };
}
