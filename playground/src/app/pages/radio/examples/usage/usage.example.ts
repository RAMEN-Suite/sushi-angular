import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, Fieldset, FieldsetContent, FieldsetLegend, Label, Radio } from '@ramen-suite/sushi';

interface PlanForm {
  plan: string;
}

@Component({
  selector: 'pg-radio-usage-example',
  imports: [FormField, Button, Fieldset, FieldsetContent, FieldsetLegend, Label, Radio],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioUsageExample {
  protected readonly model: WritableSignal<PlanForm> = signal<PlanForm>({ plan: 'starter' });
  protected readonly planForm: FieldTree<PlanForm> = form(this.model);

  protected reset(): void {
    this.planForm().reset({ plan: 'starter' });
  }
}
