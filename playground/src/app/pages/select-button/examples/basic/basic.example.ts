import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, Card, Label, SelectButton, SelectButtonOption, SelectButtonValue } from '@ramen-suite/sushi';

interface AlignmentForm {
  alignment: SelectButtonValue | null;
}

@Component({
  selector: 'pg-select-button-basic-example',
  imports: [FormField, Button, Card, Label, SelectButton],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButtonBasicExample {
  protected readonly options: readonly SelectButtonOption[] = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];
  protected readonly billingOptions: readonly SelectButtonOption[] = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];
  protected readonly billing: WritableSignal<SelectButtonValue | null> = signal<SelectButtonValue | null>('yearly');
  protected readonly model: WritableSignal<AlignmentForm> = signal<AlignmentForm>({ alignment: 'left' });
  protected readonly alignmentForm: FieldTree<AlignmentForm> = form(this.model);

  protected reset(): void {
    this.alignmentForm().reset({ alignment: 'left' });
    this.billing.set('yearly');
  }
}
