import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@sushi-kit/angular';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExamplePreview } from '../../shared/example-code/example-preview.directive';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import addressHtml from './examples/address/address.example.html';
import * as addressTs from './examples/address/address.example.ts' with { loader: 'text' };
import { InputGroupAddressExample } from './examples/address/address.example';
import commerceHtml from './examples/commerce/commerce.example.html';
import * as commerceTs from './examples/commerce/commerce.example.ts' with { loader: 'text' };
import { InputGroupCommerceExample } from './examples/commerce/commerce.example';

@Component({
  selector: 'pg-input-group-page',
  imports: [Badge, ExampleCode, ExamplePreview, InputGroupAddressExample, InputGroupCommerceExample],
  templateUrl: './input-group.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupPage {
  protected readonly examples: Readonly<Record<'address' | 'commerce', ExampleSource>> = {
    address: { html: addressHtml, typescript: textSource(addressTs) },
    commerce: { html: commerceHtml, typescript: textSource(commerceTs) },
  };
}
