import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, InputNumber, Label } from '@sushi-kit/angular';

interface BudgetModel {
  amount: number | null;
}

@Component({
  selector: 'pg-input-number-basic-example',
  imports: [FormField, Button, InputNumber, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberBasicExample {
  protected readonly model: WritableSignal<BudgetModel> = signal({ amount: 1250.5 });
  protected readonly form: FieldTree<BudgetModel> = form(this.model);

  protected reset(): void {
    this.form().reset({ amount: 1250.5 });
  }
}
