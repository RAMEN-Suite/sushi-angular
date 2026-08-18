import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideBadgeCheck, LucideChevronsUpDown, LucideCircleX } from '@lucide/angular';
import {
  Badge,
  Button,
  Join,
  JoinItem,
  Label,
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
  selector: 'pg-multi-select-templates-example',
  imports: [
    Badge,
    Button,
    Join,
    JoinItem,
    Label,
    LucideBadgeCheck,
    LucideChevronsUpDown,
    LucideCircleX,
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
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectTemplatesExample {
  protected readonly options: readonly MultiSelectOption[] = [
    { label: 'Product design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal<MultiSelectModelValue>(['design']);
  protected readonly loading: WritableSignal<boolean> = signal(false);

  protected toggleLoading(): void {
    this.loading.update((value: boolean): boolean => !value);
  }
}
