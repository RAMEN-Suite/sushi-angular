import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Fieldset, FieldsetLegend, Label, Select, SelectModelValue, SelectOption } from '@sushi-kit/angular';

@Component({
  selector: 'pg-select-states-example',
  imports: [Fieldset, FieldsetLegend, Label, Select],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectStatesExample {
  protected readonly options: readonly SelectOption[] = [
    { label: 'Standard', value: 'standard' },
    { label: 'Priority', value: 'priority' },
    { label: 'Scheduled', value: 'scheduled' },
  ];
  protected readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>('standard');
  protected readonly invalidValue: WritableSignal<SelectModelValue> = signal<SelectModelValue>(null);
}
