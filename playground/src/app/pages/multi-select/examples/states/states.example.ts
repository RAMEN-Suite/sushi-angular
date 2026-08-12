import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Fieldset,
  FieldsetLegend,
  FormFieldHint,
  FormFieldLabel,
  Label,
  MultiSelect,
  MultiSelectModelValue,
  MultiSelectOption,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-multi-select-states-example',
  imports: [Fieldset, FieldsetLegend, FormFieldHint, FormFieldLabel, Label, MultiSelect],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectStatesExample {
  protected readonly options: readonly MultiSelectOption[] = [
    { label: 'Important', value: 'important' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal(['important', 'work']);
  protected readonly invalidValue: WritableSignal<MultiSelectModelValue> = signal([]);
}
