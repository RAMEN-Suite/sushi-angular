import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormFieldLabel, InputNumber, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-number-limits-example',
  imports: [FormFieldLabel, InputNumber, Label],
  templateUrl: './limits.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberLimitsExample {}
