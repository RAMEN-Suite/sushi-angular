import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Fieldset, FieldsetLegend, Textarea } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-textarea-states-example',
  imports: [Fieldset, FieldsetLegend, Textarea],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaStatesExample {}
