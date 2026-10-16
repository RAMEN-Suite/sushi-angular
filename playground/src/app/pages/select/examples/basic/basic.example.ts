import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { type FieldTree, form, FormField, required } from '@angular/forms/signals';
import { Label, Select, type SelectModelValue, type SelectOption } from '@sushi-kit/angular';

interface ColorForm {
  color: SelectModelValue;
}

@Component({
  selector: 'pg-select-basic-example',
  imports: [FormField, Label, Select],
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
}
