import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Badge,
  Chip,
  FormFieldHint,
  FormFieldLabel,
  Label,
  MultiSelect,
  MultiSelectCompareWith,
  MultiSelectItemTemplate,
  MultiSelectModelValue,
  MultiSelectOption,
  MultiSelectSelectedItemsTemplate,
  MultiSelectValue,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-multi-select-selected-example',
  imports: [
    Badge,
    Chip,
    FormFieldHint,
    FormFieldLabel,
    Label,
    MultiSelect,
    MultiSelectItemTemplate,
    MultiSelectSelectedItemsTemplate,
  ],
  templateUrl: './selected.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectSelectedExample {
  protected readonly teams: readonly MultiSelectOption[] = [
    { label: 'Design', value: { id: 'design' } },
    { label: 'Engineering', value: { id: 'engineering' } },
    { label: 'Research', value: { id: 'research' } },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal([{ id: 'design' }, { id: 'engineering' }]);
  protected readonly compareTeams: MultiSelectCompareWith = (first: MultiSelectValue, second: MultiSelectValue): boolean =>
    typeof first === 'object' && typeof second === 'object' && 'id' in first && 'id' in second && first.id === second.id;
}
