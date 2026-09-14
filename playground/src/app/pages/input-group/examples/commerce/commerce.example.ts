import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Input, InputGroup, InputGroupAddon, JoinItem, Select, SelectOption } from '@sushi-kit/angular';

@Component({
  selector: 'pg-input-group-commerce-example',
  imports: [Button, Input, InputGroup, InputGroupAddon, JoinItem, Select],
  templateUrl: './commerce.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupCommerceExample {
  protected readonly periods: readonly SelectOption[] = [
    { label: 'Monthly', value: 'month' },
    { label: 'Yearly', value: 'year' },
  ];
}
