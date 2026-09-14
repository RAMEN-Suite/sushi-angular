import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, required } from '@angular/forms/signals';
import { Button, Join, JoinItem, Label, Select, SelectModelValue, SelectOption } from '@sushi-kit/angular';

interface ColorForm {
  color: SelectModelValue;
}

@Component({
  selector: 'pg-select-basic-example',
  imports: [FormField, Button, Join, JoinItem, Label, Select],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBasicExample {
  protected readonly colors: readonly SelectOption[] = [
    { label: 'Crimson', value: 'crimson' },
    { label: 'Indigo', value: 'indigo' },
    { label: 'Emerald', value: 'emerald' },
  ];
  protected readonly model: WritableSignal<ColorForm> = signal<ColorForm>({ color: 'crimson' });
  protected readonly colorForm: FieldTree<ColorForm> = form(this.model, (schema) => required(schema.color));

  protected reset(): void {
    this.colorForm().reset({ color: 'crimson' });
  }
}
