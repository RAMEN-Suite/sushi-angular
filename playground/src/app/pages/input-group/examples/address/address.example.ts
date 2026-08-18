import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, InputGroup, InputGroupAddon, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-group-address-example',
  imports: [Input, InputGroup, InputGroupAddon, JoinItem],
  templateUrl: './address.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupAddressExample {}
