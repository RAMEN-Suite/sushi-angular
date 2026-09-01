import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Divider, Fieldset, FieldsetContent, FieldsetLegend, FieldsetToggle, Input, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-fieldset-controlled-example',
  imports: [Button, Divider, Fieldset, FieldsetContent, FieldsetLegend, FieldsetToggle, Input, Label],
  templateUrl: './controlled.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetControlledExample {
  protected readonly expanded: WritableSignal<boolean> = signal<boolean>(true);
}
