import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-datalist-example',
  imports: [Input, Label],
  templateUrl: './datalist.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDatalistExample {}
