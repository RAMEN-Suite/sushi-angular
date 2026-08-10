import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-datalist-example',
  imports: [Input],
  templateUrl: './datalist.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDatalistExample {}
