import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideGlobe } from '@lucide/angular';
import { MultiSelect, MultiSelectGroupTemplate, MultiSelectModelValue, MultiSelectOption } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-multi-select-groups-example',
  imports: [MultiSelect, MultiSelectGroupTemplate, LucideGlobe],
  templateUrl: './groups.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectGroupsExample {
  protected readonly departments: readonly MultiSelectOption[] = [
    { label: 'Frontend', value: 'frontend', group: 'Engineering' },
    { label: 'Backend', value: 'backend', group: 'Engineering' },
    { label: 'Design', value: 'design', group: 'Product' },
    { label: 'Research', value: 'research', group: 'Product' },
    { label: 'Support', value: 'support', group: 'Operations' },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal(['frontend', 'design']);
}
