import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideBadgeCheck, LucideChevronsUpDown, LucideCircleX } from '@lucide/angular';
import {
  MultiSelect,
  MultiSelectCheckmarkIconTemplate,
  MultiSelectClearIconTemplate,
  MultiSelectDropdownIconTemplate,
  MultiSelectEmptyTemplate,
  MultiSelectFooterTemplate,
  MultiSelectHeaderTemplate,
  MultiSelectLoadingIconTemplate,
  MultiSelectLoadingTemplate,
  MultiSelectModelValue,
  MultiSelectOption,
  Spinner,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-multi-select-states-example',
  imports: [
    MultiSelect,
    MultiSelectCheckmarkIconTemplate,
    MultiSelectClearIconTemplate,
    MultiSelectDropdownIconTemplate,
    MultiSelectEmptyTemplate,
    MultiSelectFooterTemplate,
    MultiSelectHeaderTemplate,
    MultiSelectLoadingIconTemplate,
    MultiSelectLoadingTemplate,
    Spinner,
    LucideBadgeCheck,
    LucideChevronsUpDown,
    LucideCircleX,
  ],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectStatesExample {
  protected readonly options: readonly MultiSelectOption[] = [
    { label: 'Important', value: 'important' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal(['important', 'work', 'personal']);
}
