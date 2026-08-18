import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideBadgeCheck, LucideChevronsUpDown, LucideCircleX } from '@lucide/angular';
import {
  Button,
  Join,
  JoinItem,
  Label,
  Select,
  SelectCheckmarkIconTemplate,
  SelectClearIconTemplate,
  SelectDropdownIconTemplate,
  SelectEmptyTemplate,
  SelectFooterTemplate,
  SelectHeaderTemplate,
  SelectLoadingIconTemplate,
  SelectLoadingTemplate,
  SelectModelValue,
  SelectOption,
  Spinner,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-select-templates-example',
  imports: [
    Button,
    Join,
    JoinItem,
    Label,
    Select,
    SelectCheckmarkIconTemplate,
    SelectClearIconTemplate,
    SelectDropdownIconTemplate,
    SelectEmptyTemplate,
    SelectFooterTemplate,
    SelectHeaderTemplate,
    SelectLoadingIconTemplate,
    SelectLoadingTemplate,
    Spinner,
    LucideBadgeCheck,
    LucideChevronsUpDown,
    LucideCircleX,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTemplatesExample {
  protected readonly options: readonly SelectOption[] = [
    { label: 'Product design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
  ];
  protected readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>('design');
  protected readonly loading: WritableSignal<boolean> = signal(false);

  protected toggleLoading(): void {
    this.loading.update((value: boolean): boolean => !value);
  }
}
