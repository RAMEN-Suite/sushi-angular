import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChevronRight } from '@lucide/angular';
import { Button, Fieldset, FieldsetContent, FieldsetLegend, FieldsetToggle, Input, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-fieldset-toggles-example',
  imports: [LucideChevronRight, Button, Fieldset, FieldsetContent, FieldsetLegend, FieldsetToggle, Input, Label],
  templateUrl: './toggles.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetTogglesExample {
  protected readonly detailsExpanded: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly advancedExpanded: WritableSignal<boolean> = signal<boolean>(false);

  protected reset(): void {
    this.detailsExpanded.set(true);
    this.advancedExpanded.set(false);
  }
}
