import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-states-example',
  imports: [Input],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStatesExample {}
