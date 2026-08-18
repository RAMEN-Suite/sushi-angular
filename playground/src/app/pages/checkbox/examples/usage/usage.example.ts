import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, Checkbox, Label } from '@ramen-suite/sushi';

interface Preferences {
  accepted: boolean;
}

@Component({
  selector: 'pg-checkbox-usage-example',
  imports: [FormField, Button, Checkbox, Label],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxUsageExample {
  protected readonly model: WritableSignal<Preferences> = signal<Preferences>({ accepted: false });
  protected readonly preferencesForm: FieldTree<Preferences> = form(this.model);

  protected reset(): void {
    this.preferencesForm().reset({ accepted: false });
  }
}
