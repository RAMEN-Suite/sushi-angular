import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import basicHtml from './examples/basic/basic.example.html';
import * as basicTs from './examples/basic/basic.example.ts' with { loader: 'text' };
import { InputOtpBasicExample } from './examples/basic/basic.example';
import formatsHtml from './examples/formats/formats.example.html';
import * as formatsTs from './examples/formats/formats.example.ts' with { loader: 'text' };
import { InputOtpFormatsExample } from './examples/formats/formats.example';
import sizesHtml from './examples/sizes/sizes.example.html';
import * as sizesTs from './examples/sizes/sizes.example.ts' with { loader: 'text' };
import { InputOtpSizesExample } from './examples/sizes/sizes.example';
import statesHtml from './examples/states/states.example.html';
import * as statesTs from './examples/states/states.example.ts' with { loader: 'text' };
import { InputOtpStatesExample } from './examples/states/states.example';

@Component({
  selector: 'pg-input-otp-page',
  imports: [
    Badge,
    Card,
    CardTitle,
    ExampleCode,
    InputOtpBasicExample,
    InputOtpFormatsExample,
    InputOtpSizesExample,
    InputOtpStatesExample,
  ],
  templateUrl: './input-otp.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpPage {
  protected readonly examples: Readonly<Record<'basic' | 'formats' | 'sizes' | 'states', ExampleSource>> = {
    basic: { html: basicHtml, typescript: textSource(basicTs) },
    formats: { html: formatsHtml, typescript: textSource(formatsTs) },
    sizes: { html: sizesHtml, typescript: textSource(sizesTs) },
    states: { html: statesHtml, typescript: textSource(statesTs) },
  };
}
