import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Fieldset, FieldsetLegend, Label, Textarea } from '@sushi-kit/angular';

@Component({
  selector: 'pg-textarea-states-example',
  imports: [Fieldset, FieldsetLegend, Label, Textarea],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaStatesExample {}
