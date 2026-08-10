import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideGrid3x3, LucideList, LucideRows3 } from '@lucide/angular';
import { SelectButton, SelectButtonOption, SelectButtonOptionTemplate, SelectButtonValue } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-select-button-template-example',
  imports: [SelectButton, SelectButtonOptionTemplate, LucideGrid3x3, LucideList, LucideRows3],
  templateUrl: './template.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectButtonTemplateExample {
  protected readonly options: readonly SelectButtonOption[] = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Board', value: 'board' },
  ];
  protected readonly value: WritableSignal<SelectButtonValue | null> = signal<SelectButtonValue | null>('grid');
}
