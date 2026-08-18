import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Label, MultiSelect, MultiSelectModelValue, MultiSelectOption } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-multi-select-behavior-example',
  imports: [Label, MultiSelect],
  templateUrl: './behavior.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectBehaviorExample {
  protected readonly permissions: readonly MultiSelectOption[] = Array.from(
    { length: 12 },
    (_value: unknown, index: number): MultiSelectOption => ({
      label: `Permission ${index + 1}`,
      value: `permission-${index + 1}`,
    }),
  );
  protected readonly empty: readonly MultiSelectOption[] = [];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal<MultiSelectModelValue>([]);
  protected readonly closeCount: WritableSignal<number> = signal(0);

  protected closed(): void {
    this.closeCount.update((count: number): number => count + 1);
  }
}
