import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Label, SelectButton, SelectButtonOption, SelectButtonValue } from '@sushi-kit/angular';

@Component({
  selector: 'pg-select-button-layout-example',
  imports: [Label, SelectButton],
  templateUrl: './layout.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButtonLayoutExample {
  protected readonly options: readonly SelectButtonOption[] = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Board', value: 'board', disabled: true },
  ];
  protected readonly priorityOptions: readonly SelectButtonOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];
  protected readonly value: WritableSignal<SelectButtonValue | null> = signal<SelectButtonValue | null>('list');
}
