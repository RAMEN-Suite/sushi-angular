import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, minLength } from '@angular/forms/signals';
import { Button, Join, JoinItem, Label, MultiSelect, MultiSelectModelValue, MultiSelectOption } from '@sushi-kit/angular';

interface LabelForm {
  labels: MultiSelectModelValue;
}

@Component({
  selector: 'pg-multi-select-basic-example',
  imports: [FormField, Button, Join, JoinItem, Label, MultiSelect],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectBasicExample {
  protected readonly labels: readonly MultiSelectOption[] = [
    { label: 'Important', value: 'important' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
    { label: 'Archived', value: 'archived', disabled: true },
  ];
  protected readonly model: WritableSignal<LabelForm> = signal<LabelForm>({ labels: ['important', 'work'] });
  protected readonly labelForm: FieldTree<LabelForm> = form(this.model, (schema) => minLength(schema.labels, 2));

  protected reset(): void {
    this.labelForm().reset({ labels: ['important', 'work'] });
  }
}
