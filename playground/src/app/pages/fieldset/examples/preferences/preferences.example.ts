import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Checkbox, Divider, Fieldset, FieldsetLegend, Input, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-fieldset-preferences-example',
  imports: [Button, Checkbox, Divider, Fieldset, FieldsetLegend, Input, Label],
  templateUrl: './preferences.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetPreferencesExample {}
