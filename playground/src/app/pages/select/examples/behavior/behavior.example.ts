import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormFieldHint, FormFieldLabel, Label, Select, SelectModelValue, SelectOption } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-select-behavior-example',
  imports: [FormFieldHint, FormFieldLabel, Label, Select],
  templateUrl: './behavior.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBehaviorExample {
  protected readonly workflows: readonly SelectOption[] = Array.from(
    { length: 12 },
    (_value: unknown, index: number): SelectOption => ({
      label: `Workflow ${index + 1}`,
      value: `workflow-${index + 1}`,
    }),
  );
  protected readonly empty: readonly SelectOption[] = [];
  protected readonly value: WritableSignal<SelectModelValue> = signal<SelectModelValue>(null);
  protected readonly closeCount: WritableSignal<number> = signal(0);

  protected closed(): void {
    this.closeCount.update((count: number): number => count + 1);
  }
}
