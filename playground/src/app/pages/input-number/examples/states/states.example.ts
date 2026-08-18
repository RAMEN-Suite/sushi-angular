import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputNumber, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-number-states-example',
  imports: [InputNumber, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberStatesExample {}
