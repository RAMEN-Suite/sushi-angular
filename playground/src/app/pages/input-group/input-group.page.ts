import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Card, CardTitle } from '@ramen-suite/sushi';
import { apiReference } from '../../generated/api-reference.generated';
import { ApiReference } from '../../shared/api-reference/api-reference.component';
import type { ApiReferenceData } from '../../shared/api-reference/api-reference.types';
import { ExampleCode } from '../../shared/example-code/example-code.component';
import { ExampleSource, textSource } from '../../shared/example-code/example-source';
import addressHtml from './examples/address/address.example.html';
import * as addressTs from './examples/address/address.example.ts' with { loader: 'text' };
import { InputGroupAddressExample } from './examples/address/address.example';
import commerceHtml from './examples/commerce/commerce.example.html';
import * as commerceTs from './examples/commerce/commerce.example.ts' with { loader: 'text' };
import { InputGroupCommerceExample } from './examples/commerce/commerce.example';

@Component({
  selector: 'pg-input-group-page',
  imports: [Badge, Card, CardTitle, ApiReference, ExampleCode, InputGroupAddressExample, InputGroupCommerceExample],
  templateUrl: './input-group.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupPage {
  protected readonly api: readonly ApiReferenceData[] = [apiReference.InputGroup, apiReference.InputGroupAddon];
  protected readonly examples: Readonly<Record<'address' | 'commerce', ExampleSource>> = {
    address: { html: addressHtml, typescript: textSource(addressTs) },
    commerce: { html: commerceHtml, typescript: textSource(commerceTs) },
  };
}
