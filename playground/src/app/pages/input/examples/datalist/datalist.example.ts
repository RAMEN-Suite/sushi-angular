import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-input-datalist-example',
  imports: [Input, Label],
  templateUrl: './datalist.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDatalistExample {}
