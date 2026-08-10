import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideMinus, LucidePlus } from '@lucide/angular';
import { Button, FormFieldLabel, InputNumber, InputNumberButtonsTemplate, JoinItem, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-number-limits-example',
  imports: [LucideMinus, LucidePlus, Button, FormFieldLabel, InputNumber, InputNumberButtonsTemplate, JoinItem, Label],
  templateUrl: './limits.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberLimitsExample {}
