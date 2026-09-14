import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-input-states-example',
  imports: [Input, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStatesExample {}
