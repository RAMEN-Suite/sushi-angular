import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideMinus, LucidePlus } from '@lucide/angular';
import { Button, InputNumber, InputNumberButtonsTemplate, JoinItem, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-input-number-limits-example',
  imports: [LucideMinus, LucidePlus, Button, InputNumber, InputNumberButtonsTemplate, JoinItem, Label],
  templateUrl: './limits.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberLimitsExample {}
